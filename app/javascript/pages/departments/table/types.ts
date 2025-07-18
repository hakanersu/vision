type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

type Department = {
  id: string
  name: string
  created_at: string
  updated_at: string
}
