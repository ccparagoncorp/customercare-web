import { NextRequest, NextResponse } from "next/server"
import { getProdukById, updateProduk, deleteProduk } from "@/app/actions/produk"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const produk = await getProdukById(params.id)
    
    if (!produk) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json(produk)
  } catch (error) {
    console.error("Error fetching produk:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const result = await updateProduk(params.id, formData)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json(
        { errors: result.errors },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error updating produk:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteProduk(params.id)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { errors: result.errors },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error deleting produk:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
