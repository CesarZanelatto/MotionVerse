// Chave usada para guardar o inventário no sessionStorage. Usamos o mesmo
// prefixo "motionverse:" já usado pelo faseEngine para o histórico de fases,
// e sessionStorage (não localStorage) para manter o mesmo comportamento:
// persiste entre fases/páginas enquanto a aba/sessão do navegador estiver
// aberta, e some quando o navegador é fechado (equivalente a um "save" de
// sessão de jogo, não um save permanente em disco).
const CHAVE_INVENTARIO = "motionverse:inventarioGlobal";

class Inventario {
  constructor() {
    this.itens = this._carregar();
  }

  _carregar() {
    try {
      const bruto = sessionStorage.getItem(CHAVE_INVENTARIO);
      const lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (erro) {
      console.error("Não foi possível carregar o inventário:", erro);
      return [];
    }
  }

  _salvar() {
    try {
      sessionStorage.setItem(CHAVE_INVENTARIO, JSON.stringify(this.itens));
    } catch (erro) {
      console.error("Não foi possível salvar o inventário:", erro);
    }
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

    this._salvar();
    return true;
  }

  possui(id) {
    return this.itens.some((item) => item.id === id);
  }

  remover(id) {
    const index = this.itens.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.itens.splice(index, 1);
    this._salvar();
    return true;
  }

  limpar() {
    this.itens = [];
    this._salvar();
  }

  listar() {
    return [...this.itens];
  }
}

export default Inventario;
