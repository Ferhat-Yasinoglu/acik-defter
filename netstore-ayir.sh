#!/usr/bin/env bash
# netstore klasorunu acik-defter reposundan git gecmisiyle birlikte ayirir.
#
# Calistirmadan once:
#   1) GitHub'da "netstore" adinda BOS bir repo ac (README ekleme).
#   2) Bu dosyayi acik-defter klonunun ICINDE calistir:
#        bash netstore-ayir.sh
#
# Script hicbir sey push etmez ve eski repodan hicbir sey silmez.
# O iki adimi sonda yazdirir, kontrol ettikten sonra sen calistirirsin.

set -euo pipefail

KULLANICI="Ferhat-Yasinoglu"
YENI_REPO="netstore"
KLASOR="netstore"

# --- Kontroller ---------------------------------------------------------
[ -d .git ] || { echo "HATA: burasi bir git deposu degil. acik-defter klonunun icinde calistir."; exit 1; }
[ -d "$KLASOR" ] || { echo "HATA: '$KLASOR' klasoru bulunamadi."; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "HATA: commit edilmemis degisiklik var. Once onlari commit et ya da stash'le."; exit 1; }

KOK="$(pwd)"
[ -e "../$YENI_REPO" ] && { echo "HATA: ../$YENI_REPO zaten var. Once onu tasi ya da sil."; exit 1; }

# --- 1) Gecmisi ayristir -------------------------------------------------
echo "==> netstore gecmisi ayristiriliyor..."
git branch -D netstore-only >/dev/null 2>&1 || true
git subtree split --prefix="$KLASOR" -b netstore-only

# --- 2) Yeni depoyu kur --------------------------------------------------
echo "==> Yeni depo hazirlaniyor: ../$YENI_REPO"
cd ..
mkdir "$YENI_REPO"
cd "$YENI_REPO"
git init -q
git branch -M main
git pull -q "$KOK" netstore-only
git remote add origin "https://github.com/$KULLANICI/$YENI_REPO.git"

# --- Ozet ----------------------------------------------------------------
echo
echo "Bitti. Dosyalar burada: $(pwd)"
echo "Tasinan commit sayisi: $(git rev-list --count HEAD)"
echo
git log --oneline | head -5
echo
echo "-------------------------------------------------------------"
echo "SIRADA (sen calistir):"
echo
echo "  1. Push:"
echo "     cd $(pwd) && git push -u origin main"
echo
echo "  2. GitHub > netstore > Settings > Pages > main / root"
echo
echo "  3. Site acildigini DOGRULADIKTAN sonra eski repoyu temizle:"
echo "     cd \"$KOK\""
echo "     git rm -r $KLASOR"
echo "     git rm -f netstore.zip   # varsa"
echo "     git commit -m 'netstore ayri repoya tasindi'"
echo "     git push"
echo "-------------------------------------------------------------"
