// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCouch, FaTag, FaDollarSign } from 'react-icons/fa';

// Product interface matching your API
interface Product {
    _id: string;
    furniture_name: string;
    furniture_type: string;
    furniture_price: number;
    furniture_description: string;
    special_description?: string;
    furniture_image?: string;
}

export default function ProductsPage() {
    // Add these to your component state
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [imageUrlError, setImageUrlError] = useState('');
    const [editedImagePreviewUrl, setEditedImagePreviewUrl] = useState("")
    // Validation function
    const isValidImageUrl = (url: any) => {
        try {
            const urlObj = new URL(url);
            // Check if it's a valid image URL (common extensions)
            return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(urlObj.pathname);
        } catch {
            return false;
        }
    };

    // Update validation on every change
    useEffect(() => {
        if (!imagePreviewUrl) {
            setImageUrlError('');
            return;
        }

        if (!isValidImageUrl(imagePreviewUrl)) {
            setImageUrlError('Please enter a valid image URL (jpg, png, gif, webp, or svg)');
        } else {
            setImageUrlError('');
        }
    }, [imagePreviewUrl]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch real products from your API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://back-thrumming-star-8653.fly.dev/users/furnitures'); // Adjust to your endpoint
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setProducts(data.data || []);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Add Product Handler (unchanged from your original)
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const name = formData.get('addName');
        const category = formData.get('addCategory');
        const price = formData.get('addPrice');
        const specialDescription = formData.get('addSpecialDescription');
        const description = formData.get('addDescription');
        const imageUrl = formData.get('addImageUrl')
        // Basic validation
        if (!name || !category || !price || !imageUrl) {
            alert('Please fill in all required fields.');
            return;
        }

        // Clean price (remove $, commas, etc.)
        const cleanPrice = parseFloat(price.toString().replace(/[^\d.-]/g, ''));
        if (isNaN(cleanPrice)) {
            alert('Please enter a valid price.');
            return;
        }

        const payload = {
            furniture_image: imageUrl,
            furniture_name: name,
            furniture_type: category,
            furniture_price: cleanPrice,
            special_description: specialDescription?.toString().trim() || '',
            furniture_description: description?.toString().trim() || '',
        };
        setIsSubmitting(true);

        try {
            const res = await fetch('https://back-thrumming-star-8653.fly.dev/admin/createFurniture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert('Product created successfully!');
                closeModals();
                // Refresh products list
                const response = await fetch('https://back-thrumming-star-8653.fly.dev/users/furnitures');
                const data = await response.json();
                setProducts(data.data || []);
            } else {
                const errorData = await res.json();
                alert('Failed to create product: ' + (errorData.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModals = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedProduct(null);
        document.body.style.overflow = 'auto';
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="text-red-700">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-amber-900">Products</h1>
                    <p className="text-amber-700 mt-2">Manage your product catalog</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition duration-300"
                >
                    <FaPlus className="mr-2" />
                    Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
                <table className="min-w-full divide-y divide-amber-100">
                    <thead className="bg-amber-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-amber-100">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-amber-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="bg-amber-100 p-2 rounded-lg mr-3">
                                            <FaCouch className="text-amber-700" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-amber-900">{product.furniture_name}</div>
                                            {product.special_description && (
                                                <div className="text-amber-700 text-sm italic">"{product.special_description}"</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-amber-700">
                                    <div className="flex items-center">
                                        <FaTag className="mr-2 text-amber-600" />
                                        {product.furniture_type}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-amber-900">
                                    <div className="flex items-center">
                                        <FaDollarSign className="mr-1 text-amber-700" />
                                        {product.furniture_price} Birr
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="text-amber-700 hover:text-amber-900 mr-3"
                                        aria-label="Edit product"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button className="text-red-600 hover:text-red-900" aria-label="Delete product">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-amber-500 mb-2">
                            <FaCouch className="text-4xl mx-auto" />
                        </div>
                        <p className="text-amber-700">No products found</p>
                    </div>
                )}
            </div>

            {/* Add Product Modal (UNCHANGED from your original) */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-amber-200 flex justify-between items-center p-6">
                            <h2 className="text-2xl font-bold text-amber-900">Add New Product</h2>
                            <button
                                onClick={closeModals}
                                className="text-amber-700 hover:text-amber-900"
                                aria-label="Close modal"
                            >
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="addName" className="block text-amber-800 font-medium mb-2">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="addName"
                                            name="addName"
                                            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="addCategory" className="block text-amber-800 font-medium mb-2">
                                            Category *
                                        </label>
                                        <select
                                            id="addCategory"
                                            name="addCategory"
                                            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        >
                                            <option>Sofa</option>
                                            <option>Bed</option>
                                            <option>Book_Shelf</option>
                                            <option>Shoe_Rack</option>
                                            <option>Floating_Shelf</option>
                                            <option>Wardrobe</option>
                                            <option>Kitchen_Cabinet</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="addPrice" className="block text-amber-800 font-medium mb-2">
                                            Price *
                                        </label>
                                        <input
                                            type="text"
                                            id="addPrice"
                                            name="addPrice"
                                            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="addSpecialDescription" className="block text-amber-800 font-medium mb-2">
                                            Special Description
                                        </label>
                                        <textarea
                                            id="addSpecialDescription"
                                            rows={2}
                                            name="addSpecialDescription"
                                            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="Enter special description"
                                        ></textarea>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="addDescription" className="block text-amber-800 font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="addDescription"
                                        rows={4}
                                        name="addDescription"
                                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Enter product description"
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="addImageUrl" className="block text-amber-800 font-medium mb-2">
                                        Image URL *
                                    </label>
                                    <input
                                        type="url"
                                        id="addImageUrl"
                                        name="addImageUrl"
                                        value={imagePreviewUrl}
                                        onChange={(e) => setImagePreviewUrl(e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${imageUrlError
                                            ? 'border-red-400 focus:ring-red-500'
                                            : 'border-amber-300 focus:ring-amber-500'
                                            }`}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {imageUrlError && (
                                        <p className="mt-1 text-sm text-red-600">{imageUrlError}</p>
                                    )}
                                </div>

                                {/* === IMAGE PREVIEW === */}
                                {imagePreviewUrl && !imageUrlError && (
                                    <div className="mt-2">
                                        <p className="text-amber-800 font-medium mb-2">Preview:</p>
                                        <div className="flex justify-center">
                                            <img
                                                src={imagePreviewUrl}
                                                alt="Product preview"
                                                className="max-h-64 w-auto object-contain border border-amber-200 rounded-lg shadow-sm"
                                                onError={() => setImagePreviewUrl('')} // Clear on error
                                            />
                                        </div>
                                    </div>
                                )}


                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModals}
                                        className="px-6 py-2 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Adding...' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal (Simplified - no status field) */}
            {isEditModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-amber-200 flex justify-between items-center p-6">
                            <h2 className="text-2xl font-bold text-amber-900">Edit Product</h2>
                            <button
                                onClick={closeModals}
                                className="text-amber-700 hover:text-amber-900"
                                aria-label="Close modal"
                            >
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="editName" className="block text-amber-800 font-medium mb-2">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="editName"
                                            defaultValue={selectedProduct.furniture_name}
                                            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="editCategory" className="block text-amber-800 font-medium mb-2">
                                            Category *
                                        </label>
                                        <select
                                            id="editCategory"
                                            defaultValue={selectedProduct.furniture_type}
                                            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        >
                                            <option>Chair</option>
                                            <option>Sofa</option>
                                            <option>Bedroom</option>
                                            <option>Dining</option>
                                            <option>Lighting</option>
                                            <option>Office</option>
                                            <option>Storage</option>
                                            <option>Decor</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="editPrice" className="block text-amber-800 font-medium mb-2">
                                            Price *
                                        </label>
                                        <input
                                            type="number"
                                            id="editPrice"
                                            defaultValue={selectedProduct.furniture_price}
                                            className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="editSpecialDescription" className="block text-amber-800 font-medium mb-2">
                                        Special Description
                                    </label>
                                    <textarea
                                        id="editSpecialDescription"
                                        rows={2}
                                        defaultValue={selectedProduct.special_description || ''}
                                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Enter special description"
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="editDescription" className="block text-amber-800 font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="editDescription"
                                        rows={4}
                                        defaultValue={selectedProduct.furniture_description}
                                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Enter product description"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-amber-800 font-medium mb-2">
                                        Product Image
                                    </label>
                                    <div>
                                        <label htmlFor="addImageUrl" className="block text-amber-800 font-medium mb-2">
                                            Image URL *
                                        </label>
                                        <input
                                            type="url"
                                            id="addImageUrl"
                                            name="addImageUrl"
                                            value={editedImagePreviewUrl}
                                            onChange={(e) => setEditedImagePreviewUrl(e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${imageUrlError
                                                ? 'border-red-400 focus:ring-red-500'
                                                : 'border-amber-300 focus:ring-amber-500'
                                                }`}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        {imageUrlError && (
                                            <p className="mt-1 text-sm text-red-600">{imageUrlError}</p>
                                        )}

                                        {/* Live Image Preview */}
                                        {editedImagePreviewUrl && (
                                            <div className="mt-4">
                                                <img
                                                    src={editedImagePreviewUrl}
                                                    alt="Live preview"
                                                    className="w-64 h-64 object-cover rounded-lg"
                                                    onError={() => setImageUrlError('Invalid image URL')}
                                                    onLoad={() => setImageUrlError('')}
                                                />
                                            </div>
                                        )}
                                    </div>


                                </div>

                                {/* Danger Zone */}
                                <div className="border-t border-amber-200 pt-6 mt-6">
                                    <h3 className="text-lg font-bold text-amber-900 mb-4">Danger Zone</h3>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-red-800">Delete Product</h4>
                                                <p className="text-red-700 text-sm mt-1">
                                                    This action cannot be undone. This will permanently delete the product.
                                                </p>
                                            </div>
                                            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
                                                <FaTrash className="mr-2" />
                                                Delete Product
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModals}
                                        className="px-6 py-2 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}