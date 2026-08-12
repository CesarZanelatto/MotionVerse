class Inventario {
  constructor() {
    this.itens = [];
  }

  adicionar(item) {
    if (!item?.id) return false;

    if (item.unico && this.possui(item.id)) {
      return false;
    }

    this.itens.push({
      id: item.id,
      nome: item.nome || item.id,
      tipo: item.tipo || "item",
      unico: Boolean(item.unico),
      img: item.img || "",
    });

    return true;
  }

  possui(id) {
    return this.itens.some((item) => item.id === id);
  }

  remover(id) {
    const index = this.itens.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.itens.splice(index, 1);
    return true;
  }

  listar() {
    return [...this.itens];
  }
}

export default Inventario;
