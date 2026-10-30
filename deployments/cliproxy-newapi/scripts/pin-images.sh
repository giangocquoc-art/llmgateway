#!/usr/bin/env bash
# Freeze the exact images already pulled during private bootstrap.
set -euo pipefail
umask 077
cd "$(dirname "$0")/.."
test -f .env || { echo "Run bash init.sh first" >&2; exit 1; }
command -v docker >/dev/null || { echo "Docker required" >&2; exit 1; }
command -v python3 >/dev/null || { echo "Python 3 required" >&2; exit 1; }

python3 - <<'PY'
import pathlib, subprocess, re, os
path=pathlib.Path(".env")
data=path.read_text()
names={"CLIPROXY_IMAGE":"eceasy/cli-proxy-api:latest",
       "NEWAPI_IMAGE":"calciumion/new-api:latest",
       "POSTGRES_IMAGE":"postgres:16-alpine",
       "REDIS_IMAGE":"redis:7-alpine",
       "CADDY_IMAGE":"caddy:2-alpine"}
for key,default in names.items():
    match=re.search(r"(?m)^"+re.escape(key)+r"=(.*)$",data)
    if not match:
        raise SystemExit("Missing .env variable: "+key)
    image_ref=match.group(1).strip() or default
    r=subprocess.run(["docker","image","inspect",image_ref,"--format","{{json .RepoDigests}}"],
                     capture_output=True,text=True)
    if r.returncode:
        raise SystemExit("Image not pulled: "+image_ref+"; run docker compose pull before pinning")
    import json
    digests=json.loads(r.stdout)
    def normalize_name(value):
        value=value.split("@",1)[0]
        last=value.rsplit("/",1)[-1]
        if ":" in last:
            value=value.rsplit(":",1)[0]
        if value.startswith("docker.io/"):
            value=value[len("docker.io/"):]
        if value.startswith("library/"):
            value=value[len("library/"):]
        return value
    target=normalize_name(image_ref)
    compatible=[d for d in digests if normalize_name(d)==target]
    # For already digest-pinned references, preserve the exact same reference.
    if "@sha256:" in image_ref:
        digest=image_ref
    elif compatible:
        digest=compatible[0]
    else:
        raise SystemExit("No matching registry digest for "+key+" / "+image_ref)
    if not re.fullmatch(r"[A-Za-z0-9_./:-]+@sha256:[a-f0-9]{64}",digest):
        raise SystemExit("Invalid image digest for "+key)
    data=re.sub(r"(?m)^"+re.escape(key)+r"=.*$",lambda _:key+"="+digest,data,count=1)
    print(key+" pinned by digest (not printing digest)")
temp=path.parent / (path.name + ".tmp")
with temp.open("w") as f: f.write(data)
os.chmod(temp,0o600)
os.replace(temp,path)
PY
echo "Image versions frozen in .env; do not publish .env."
