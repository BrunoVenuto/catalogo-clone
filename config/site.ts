export const siteConfig = {
  name: "MG PHARMA",

  // 📦 Número para RECEBER PEDIDOS (somente dígitos: 55 + DDD + número)
  whatsappPedido: "5531990873780", // <-- troque pelo SEU número real de pedidos

  // 💬 Número para CONSULTORIA
  // wa.me exige somente dígitos:
  whatsappConsultoria: "5531990873780",

  // ✅ compatibilidade: se algum lugar do projeto ainda usa siteConfig.whatsapp
  // apontamos para o número de PEDIDOS
  whatsapp: "5531990873780",

  whatsappMessage:
    "Olá! Eu vim do seu site e gostaria de fazer um pedido com os seguintes itens:",
  consultoriaMessage:
    "Olá, preciso de ajuda com meu projeto..",

  hero: {
    title: "MG PHARMA",
    subtitle:
      "Resultados extremos e produtos de confiança!",
    cta: "Conheça",

    imageDesktop: "/images/mg-pharma-logo.jpg",
    imageMobile: "/images/mg-pharma-logo.jpg",
  },

  menu: [
    { label: "Home", href: "#home" },
    { label: "Coleções", href: "#produtos" },
    { label: "Produtos", href: "#produtos" },
    { label: "Contato", href: "#contato" },
  ],
};
