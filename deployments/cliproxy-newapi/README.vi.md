# Triển khai CLIProxyAPI + New API trên Ubuntu/Debian (Tiếng Việt)

**Chưa triển khai lên VPS.** Đây là cấu hình Docker trong repo để bạn vận hành API Gateway. New API cấp key/quota từng người; CLIProxyAPI kết nối nguồn model AI hợp lệ. PostgreSQL/Redis chỉ chạy nội bộ.

## Chuẩn bị
- Docker Engine + Compose Plugin, openssl, git, curl, python3.
- DNS A record api.example.com → IP VPS. Mở 80/443 TCP và giữ SSH.
- Kiểm tra mạng 172.30.44.0/24 chưa bị sử dụng trên VPS. Nếu trùng, đổi cả subnet, IP Caddy và TRUSTED_PROXIES trong compose.yaml.

## Cài đặt

```bash
git clone --filter=blob:none --no-checkout --single-branch -b feat/cliproxy-newapi-vps https://github.com/giangocquoc-art/llmgateway.git
cd llmgateway
git sparse-checkout init --cone
git sparse-checkout set deployments/cliproxy-newapi
git checkout
cd deployments/cliproxy-newapi
bash init.sh api.example.com
bash scripts/check.sh
docker compose -f compose.yaml -f compose.bootstrap.yaml pull
docker compose -f compose.yaml -f compose.bootstrap.yaml up -d new-api
```

**Quan trọng:** chưa mở HTTPS công khai. Cài tài khoản quản trị qua SSH tunnel trước để tránh người khác chiếm tài khoản quản trị đầu tiên.

Trên máy cá nhân:

```bash
ssh -N -L 3000:127.0.0.1:3000 USER_SSH@IP_VPS
```

Trên máy cá nhân vào **http://127.0.0.1:3000**, tạo tài khoản root, đặt mật khẩu mạnh và tắt đăng ký công khai. Địa chỉ HTTP này chỉ được mở qua SSH tunnel đã mã hóa.

## Chuyển sang công khai qua HTTPS

Trên VPS, khóa 5 image theo SHA-256 để tránh bản mới âm thầm thay đổi:

```bash
bash scripts/pin-images.sh
bash scripts/production-preflight.sh
```

Chạy trên VPS:

```bash
docker compose -f compose.yaml up -d --force-recreate new-api caddy
docker compose -f compose.yaml ps
docker compose -f compose.yaml config -q
```

Chỉ Caddy được publish cổng 80/443. **Không được chạy production cùng compose.bootstrap.yaml** (vì override đó tắt secure cookie và mở cổng 3000 trên localhost).

## Kết nối AI & quota
1. Chọn nguồn AI có quyền chia sẻ API, sửa `cliproxy/config.yaml` theo `UPSTREAM.example.yaml`. Sau đó `docker compose restart cliproxy`.
2. New API → Channels → Add, type OpenAI-compatible. URL: `http://cliproxy:8317`; Key: `access.api-keys` trong config CLIProxyAPI. Test channel.
3. Đặt model pricing, hạn mức và nhóm model trước khi tạo key người dùng. Quota New API dựa trên giá quy đổi, **không mặc định là token thô**.
4. Chỉ phát **New API user key** cho từng người, không phát key nội bộ hay OAuth source.
5. Test bằng `PUBLIC_API=https://api.example.com bash scripts/smoke.sh MODEL_ID`, script hỏi key nhưng không hiện ký tự.

## Vận hành & an toàn

```bash
docker compose ps
docker compose logs --tail=100 new-api cliproxy
bash scripts/backup.sh
```

Cần sao lưu `.env`, `cliproxy/config.yaml`, `cliproxy/auths/` an toàn ngoài VPS và kiểm thử phục hồi. Pin Docker image theo release/digest đã kiểm tra trước khi chạy thật. Chỉ dùng nguồn API tuân thủ điều khoản cung cấp dịch vụ.

Bản hướng dẫn kỹ thuật: [README.md](README.md).
