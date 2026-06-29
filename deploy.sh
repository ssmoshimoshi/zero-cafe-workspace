#!/bin/bash

# deploy.sh - Script untuk otomatis push ke GitHub dan Google Apps Script (clasp)

echo "=== Memulai Proses Deploy ==="

# 1. Tambah file dan commit ke Git lokal
echo "1. Melakukan Git commit..."
git add .
# Jika ada perubahan, commit. Jika tidak ada, lanjutkan saja
git commit -m "Pembaruan otomatis: $(date '+%Y-%m-%d %H:%M:%S')" || echo "Tidak ada perubahan kode baru untuk di-commit."

# 2. Push ke GitHub (hanya jika remote 'origin' sudah ditambahkan oleh user)
if git remote | grep -q 'origin'; then
  echo "2. Melakukan push ke GitHub (origin)..."
  # Menentukan branch aktif saat ini
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  git push origin "$CURRENT_BRANCH"
else
  echo "2. [INFO] Remote 'origin' belum dikonfigurasi. Lewati langkah push GitHub."
  echo "   (Hubungkan ke repositori GitHub baru Anda terlebih dahulu dengan perintah yang diberikan)"
fi

# 3. Push ke Google Apps Script via clasp
echo "3. Melakukan push dan deploy ke Google Apps Script..."
clasp push
clasp deploy -i AKfycbz7mSoOmKpOtZnACm0LwFnmOGtZL-KlUOekGzylA8b20_j9mMsom1dgaSNExQ2OJTUp -d "Pembaruan otomatis dari deploy.sh"

echo "=== Selesai! Aplikasi Anda telah diperbarui di GAS dan GitHub ==="
