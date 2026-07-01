/* ======================================================
   ESCALA.JS
   Mantém o design INTEIRO (feito para 1400px) idêntico em
   qualquer tela. Não muda nenhuma posição/tamanho do CSS —
   apenas aplica um "zoom" (scale) na página toda, do mesmo
   jeito que um PDF ou uma imagem se ajusta à tela.
   ====================================================== */
(function () {
  var BASE_WIDTH = 1400; // largura em que o design foi feito
  var wrapper = document.getElementById('pageScale');

  if (!wrapper) return;

  function larguraReal() {
    // clientWidth ignora barra de rolagem e é mais confiável
    // que innerWidth em navegadores de celular
    return document.documentElement.clientWidth || window.innerWidth;
  }

  function ajustarEscala() {
    var escala = larguraReal() / BASE_WIDTH;

    wrapper.style.transform = 'scale(' + escala + ')';
    wrapper.style.webkitTransform = 'scale(' + escala + ')';

    // Sem isso, sobraria um espaço em branco embaixo do tamanho
    // do "canvas" original (1400px) mesmo com o conteúdo escalado.
    document.body.style.height = (wrapper.scrollHeight * escala) + 'px';
  }

  window.addEventListener('resize', ajustarEscala);
  window.addEventListener('orientationchange', ajustarEscala);

  // Em celulares, a barra de endereço aparecer/sumir dispara
  // isso de forma mais confiável do que o resize comum
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', ajustarEscala);
  }

  // Recalcula de novo depois que as imagens carregarem
  // (imagens carregando tarde podem mudar a altura real da página)
  window.addEventListener('load', function () {
    ajustarEscala();
    setTimeout(ajustarEscala, 300);
    setTimeout(ajustarEscala, 1000);
  });

  ajustarEscala();
})();
