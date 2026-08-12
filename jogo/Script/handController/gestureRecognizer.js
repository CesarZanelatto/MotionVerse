/* ==========================================
   Motion Verse
   gestureRecognizer.js

   Neste projeto, vamos simplificar:
   - mão "aberta" => comando ativo
   - mão "fechada"/não detectada => comando inativo
========================================== */

export function gestureParaComando({ presente, aberta }) {

    // Se não viu mão, não ativa comando.
    if (!presente) {
        return { ativo: false };
    }

    // Se viu mão aberta, ativa comando.
    // Pode ser refinado depois (pinça, swipe etc.).
    return { ativo: Boolean(aberta) };
}
