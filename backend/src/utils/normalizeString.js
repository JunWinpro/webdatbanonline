const normalizeString = (string) => {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}
export default normalizeString

console.log(normalizeString("Nhà hàng đồng tâm"))