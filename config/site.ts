export const siteConfig = {
  name: "Projeto Giga",

  // 📦 Número para RECEBER PEDIDOS (somente dígitos: 55 + DDD + número)
  whatsappPedido: "5531995453632", // <-- troque pelo SEU número real de pedidos

  // 💬 Número para CONSULTORIA
  // wa.me exige somente dígitos:
  whatsappConsultoria: "5531995453632",

  // ✅ compatibilidade: se algum lugar do projeto ainda usa siteConfig.whatsapp
  // apontamos para o número de PEDIDOS
  whatsapp: "5531995453632",

  whatsappMessage:
    "Olá! Eu vim do seu site e gostaria de fazer um pedido com os seguintes itens:",
  consultoriaMessage:
    "Olá, preciso de uma consultoria antes de fazer meu pedido.",

  hero: {
    title: "Performance Extrema",
    subtitle:
      "Produtos de alta qualidade, atendimento especializado e entrega garantida.",
    cta: "Ver produtos",

    imageDesktop: "/images/hero-resting.png",
    imageMobile: "/images/hero-resting.png",
  },

  menu: [
    { label: "Home", href: "#home" },
    { label: "Coleções", href: "#collections" },
    { label: "Produtos", href: "#products" },
    { label: "Contato", href: "#contact" },
  ],
};
