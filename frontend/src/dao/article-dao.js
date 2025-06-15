const articleDAO = [
  {
    name: "designation",
    label: "Designation",
    type: "text",
    required: true,
    disabled: false,
    info: false,
  },
  {
    name: "prix",
    label: "Prix",
    type: "number",
    required: true,
    disabled: false,
    info: false,
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    required: false,
    disabled: false,
    info: false,
  },
  {
    name: "stock_reel",
    label: "Stock réel",
    type: "number",
    required: true,
    disabled: false,
    info: "Attention, Modifier cette valeur revient à effectuer un ajustement d'inventaire pour cet article.",
  },
];

export default articleDAO;
