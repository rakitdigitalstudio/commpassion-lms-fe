/** IDR, Indonesian thousands separators — e.g. `Rp 150.000`. */
export function formatIdr(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}
