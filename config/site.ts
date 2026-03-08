export const siteConfig = {
  name: "MegaGym Clone",

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
    "Olá, preciso de ajuda com montagem de academia ou equipamentos.",

  hero: {
    title: "MEGA RACK",
    subtitle:
      "Transforme agora o seu espaço de treino! + De 50 tipos de exercícios em um único equipamento.",
    cta: "Conheça",

    imageDesktop: "/images/hero.jpg",
    imageMobile: "/images/hero-mobile.jpg",
  },

  menu: [
    { label: "Home", href: "#home" },
    { label: "Coleções", href: "#produtos" },
    { label: "Produtos", href: "#produtos" },
    { label: "Contato", href: "#contato" },
  ],
};
