import {
  handleCreateAdminProduct,
  handleDeleteAdminProduct,
  handleUpdateAdminProduct,
} from './admin-products-route'

export async function POST(request) {
  return handleCreateAdminProduct(request)
}

export async function PATCH(request) {
  return handleUpdateAdminProduct(request)
}

export async function DELETE(request) {
  return handleDeleteAdminProduct(request)
}
