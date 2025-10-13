import { NextRequest, NextResponse } from "next/server"
import { getProduks, createProduk } from "@/app/actions/produk"

export async function GET() {
  try {
    const produks = await getProduks()
    return NextResponse.json(produks)
  } catch (error) {
    console.error("Error fetching produks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await createProduk(formData)

    if (result.success) {
      return NextResponse.json(result.data, { status: 201 })
    } else {
      return NextResponse.json(
        { errors: result.errors },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error creating produk:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
