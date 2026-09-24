const isLocalhost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

export default {
  defaultPath: "/",
  // basename: "/",
  // defaultPath: "/admin/",
  basename: "/admin/",
  layout: "vertical",
  subLayout: "",
  collapseMenu: false,
  layoutType: " menu-dark",
  headerBackColor: "background-grd-blue",
  rtlLayout: false,
  navFixedLayout: true,
  headerFixedLayout: false,
  boxLayout: false,
  mode: isLocalhost ? "DEV" : "PRO", // PRO DEV TEST
  entity: 2,
  entityName: "SEGUNDA ESPECIALIDAD FCS",
  // hostPro: "http://localhost:8899/api/",
  // hostPro: "http://38.250.161.223/api/",
  hostPro: "https://usefcs.unsm.edu.pe/api/",
};
