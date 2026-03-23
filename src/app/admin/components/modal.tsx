'use client';
import React from 'react';
import { X, Save } from 'lucide-react';
import { Product, Category, Subcategory, SubSubcategory, User, Order, UpdateOrderData } from '@/types/admin';
import { env } from 'process';

interface ModalProps {
  showModal: boolean;
  modalType: string;
  selectedItem: Product | Category | Subcategory | SubSubcategory | User | Order | null;
  categories: Category[];
  subCategories: Subcategory[];
  subSubCategories: SubSubcategory[];
  loading: boolean;
  closeModal: () => void;
  createProduct: (data: Product | FormData) => Promise<void>;
  updateProduct: (id: number, data: Product | FormData) => Promise<void>;
  createCategory: (data: Partial<Category>) => Promise<void>;
  updateCategory: (id: number, data: Partial<Category>) => Promise<void>;
  createSubCategory: (data: Partial<Subcategory>) => Promise<void>;
  updateSubCategory: (id: number, data: Partial<Subcategory>) => Promise<void>;
  createSubSubCategory: (data: Partial<SubSubcategory>) => Promise<void>;
  updateSubSubCategory: (id: number, data: Partial<SubSubcategory>) => Promise<void>;
  createUser?: (data: Partial<User>) => Promise<void>;
  updateUser?: (id: number, data: Partial<User>) => Promise<void>;
  updateOrder?: (id: number, data: UpdateOrderData) => Promise<void>;
}

const Modal: React.FC<ModalProps> = ({
  showModal,
  modalType,
  selectedItem,
  categories,
  subCategories,
  subSubCategories,
  loading,
  closeModal,
  createProduct,
  updateProduct,
  createCategory,
  updateCategory,
  createSubCategory,
  updateSubCategory,
  createSubSubCategory,
  updateSubSubCategory,
  createUser,
  updateUser,
  updateOrder
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>(() => {
    if (!selectedItem) return '';
    if ('category_id' in selectedItem) return selectedItem.category_id?.toString() || '';
    return '';
  });
  const [selectedSubCategoryId, setSelectedSubCategoryId] = React.useState<string>(() => {
    if (!selectedItem) return '';
    if ('subcategory_id' in selectedItem) return selectedItem.subcategory_id?.toString() || '';
    return '';
  });

  React.useEffect(() => {
    if (selectedItem) {
      const catId = 'category_id' in selectedItem ? selectedItem.category_id?.toString() : '';
      const subCatId = 'subcategory_id' in selectedItem ? selectedItem.subcategory_id?.toString() : '';
      setSelectedCategoryId(catId || '');
      setSelectedSubCategoryId(subCatId || '');
    } else {
      setSelectedCategoryId('');
      setSelectedSubCategoryId('');
    }
  }, [selectedItem, showModal]);

  // Narrowed types for better type safety and to avoid lint errors
  const productItem = modalType === 'product' && selectedItem ? selectedItem as Product : null;
  const categoryItem = modalType === 'category' && selectedItem ? selectedItem as Category : null;
  const subCategoryItem = modalType === 'subcategory' && selectedItem ? selectedItem as Subcategory : null;
  const subSubCategoryItem = modalType === 'sub_subcategory' && selectedItem ? selectedItem as SubSubcategory : null;
  const userItem = modalType === 'user' && selectedItem ? selectedItem as User : null;
  const orderItem = modalType === 'order' && selectedItem ? selectedItem as Order : null;

  // Parse shipping address if it's a string
  const parsedAddress = React.useMemo(() => {
    if (!orderItem?.shipping_address) return null;
    try {
      return typeof orderItem.shipping_address === 'string' 
        ? JSON.parse(orderItem.shipping_address) 
        : orderItem.shipping_address;
    } catch (e) {
      console.error('Error parsing shipping address:', e);
      return null;
    }
  }, [orderItem]);

  if (!showModal) return null;

  const isEditing = selectedItem !== null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted for modalType:', modalType, 'isEditing:', isEditing); // Debug

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      if (modalType === 'product') {
        // Products need FormData for file uploads
        if (isEditing) {
          await updateProduct(selectedItem.id, formData);
        } else {
          await createProduct(formData);
        }
      } else if (modalType === 'category') {
        const data = Object.fromEntries(formData.entries());
        if (isEditing) {
          await updateCategory(selectedItem.id, data);
        } else {
          await createCategory(data);
        }
      } else if (modalType === 'subcategory') {
        const data = Object.fromEntries(formData.entries());
        if (isEditing) {
          await updateSubCategory(selectedItem.id, data);
        } else {
          await createSubCategory(data);
        }
      } else if (modalType === 'sub_subcategory') {
        const data = Object.fromEntries(formData.entries());
        if (isEditing) {
          await updateSubSubCategory(selectedItem.id, data);
        } else {
          await createSubSubCategory(data);
        }
      } else if (modalType === 'user') {
        // Users use regular object data
        const data = Object.fromEntries(formData.entries());
        console.log('User form data:', data); // Debug

        // Remove empty password fields for editing
        if (isEditing && (!data.password || data.password === '')) {
          delete data.password;
          delete data.password_confirmation;
        }

        if (isEditing) {
          console.log('About to call updateUser with:', selectedItem.id, data); // Debug
          if (updateUser) {
            await updateUser(selectedItem.id, data);
          } else {
            console.error('updateUser function is not available'); // Debug
          }
        } else {
          console.log('About to call createUser with:', data); // Debug
          if (createUser) {
            await createUser(data);
          } else {
            console.error('createUser function is not available'); // Debug
          }
        }
      } else if (modalType === 'order') {
        const data = Object.fromEntries(formData.entries());
        const orderData: UpdateOrderData = {
          status: data.status as string,
          total_amount: parseFloat(data.total_amount as string),
          shipping_address: {
            full_name: data.full_name as string,
            phone: data.phone as string,
            address: data.address as string,
            city: data.city as string,
          }
        };

        if (isEditing && updateOrder && selectedItem) {
          await updateOrder(selectedItem.id, orderData);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Modifier' : 'Ajouter'} {
              modalType === 'product' ? 'Produit' :
                modalType === 'category' ? 'Catégorie' :
                  modalType === 'subcategory' ? 'Sous-catégorie' :
                    modalType === 'sub_subcategory' ? 'Sous-sous-catégorie' :
                      modalType === 'user' ? 'Utilisateur' : ''
            }
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
          {modalType === 'product' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nom du Produit</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={productItem?.name || ''}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-400"
                    placeholder="Nom du produit"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Marque</label>
                  <input
                    type="text"
                    name="brand"
                    defaultValue={productItem?.brand || ''}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-400"
                    placeholder="Marque du produit"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={productItem?.slug || ''}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-400"
                    placeholder="produit-slug"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    name="category_id"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900"
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value);
                      setSelectedSubCategoryId('');
                    }}
                    required
                  >
                    <option value="">Sélectionner</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sous-catégorie</label>
                  <select
                    name="subcategory_id"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-400"
                    value={selectedSubCategoryId}
                    onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                    disabled={!selectedCategoryId}
                  >
                    <option value="">Sélectionner</option>
                    {subCategories
                      .filter(sc => sc.category_id.toString() === selectedCategoryId)
                      .map(sc => (
                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sous-sous-catéc.</label>
                  <select
                    name="sub_subcategory_id"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-400"
                    defaultValue={productItem?.sub_subcategory_id || ''}
                    disabled={!selectedSubCategoryId}
                  >
                    <option value="">Sélectionner</option>
                    {subSubCategories
                      .filter(ssc => ssc.subcategory_id.toString() === selectedSubCategoryId)
                      .map(ssc => (
                        <option key={ssc.id} value={ssc.id}>{ssc.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prix Orig. (DH)</label>
                  <input
                    type="number"
                    name="original_price"
                    step="0.01"
                    defaultValue={productItem?.original_price || ''}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-400"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prix Rem. (DH)</label>
                  <input
                    type="number"
                    name="discounted_price"
                    step="0.01"
                    defaultValue={productItem?.discounted_price || ''}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-400"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    defaultValue={productItem?.stock_quantity ?? ''}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-400"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    name="status"
                    defaultValue={productItem?.status || 'active'}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900"
                  >
                    <option value="active">Actif</option>
                    <option value="draft">Brouillon</option>
                    <option value="out_of_stock">Rupture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Image du Produit</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-xs text-gray-900 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                  {productItem?.image_url && (
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <span>Actuelle:</span>
                      <a
                        href={`${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${productItem.image_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 underline"
                      >
                        Voir
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={productItem?.description || ''}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-400"
                  placeholder="Description du produit"
                ></textarea>
              </div>
            </div>
          )}

          {modalType === 'category' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la Catégorie</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={categoryItem?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="Nom de la catégorie"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={categoryItem?.slug || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="slug-categorie"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={productItem?.description || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="Description de la catégorie"
                ></textarea>
              </div>
            </div>
          )}

          {modalType === 'subcategory' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie Parent</label>
                <select
                  name="category_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                  defaultValue={subCategoryItem?.category_id || ''}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la Sous-catégorie</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={subCategoryItem?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="Nom de la sous-catégorie"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={subCategoryItem?.slug || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="slug-sous-categorie"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={productItem?.description || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="Description"
                ></textarea>
              </div>
            </div>
          )}

          {modalType === 'sub_subcategory' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sous-catégorie Parent</label>
                <select
                  name="subcategory_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                  defaultValue={subSubCategoryItem?.subcategory_id || ''}
                  required
                >
                  <option value="">Sélectionner une sous-catégorie</option>
                  {subCategories.map(sc => (
                    <option key={sc.id} value={sc.id}>{sc.name} ({categories.find(c => c.id === sc.category_id)?.name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la Sous-sous-catégorie</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={subSubCategoryItem?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="Nom de la sous-sous-catégorie"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={subSubCategoryItem?.slug || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="slug-sous-sous-categorie"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={productItem?.description || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                  placeholder="Description"
                ></textarea>
              </div>
            </div>
          )}

          {modalType === 'user' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={userItem?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                    placeholder="Nom complet de l'utilisateur"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={userItem?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                    placeholder="email@exemple.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select
                    name="role"
                    defaultValue={userItem?.role || 'user'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                  >
                    <option value="user">Client</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select 
                    name="status"
                    defaultValue={selectedItem?.status || 'active'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                  </select> */}
                </div>
              </div>

              {!isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de Passe</label>
                    <input
                      type="password"
                      name="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                      placeholder="Mot de passe"
                      required={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le Mot de Passe</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                      placeholder="Confirmer le mot de passe"
                      required={!isEditing}
                    />
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Modification de mot de passe</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Laissez les champs de mot de passe vides si vous ne souhaitez pas changer le mot de passe actuel.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau Mot de Passe (optionnel)</label>
                    <input
                      type="password"
                      name="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                      placeholder="Laisser vide pour garder l'actuel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le Nouveau Mot de Passe</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                      placeholder="Confirmer le nouveau mot de passe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Informations Supplémentaires</label>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {isEditing ? (
                    <div className="space-y-1">
                      <p><span className="font-medium">Membre depuis:</span> {userItem?.created_at ? new Date(userItem.created_at).toLocaleDateString('fr-FR') : 'N/A'}</p>
                      <p><span className="font-medium">Dernière modification:</span> {userItem?.updated_at ? new Date(userItem.updated_at).toLocaleDateString('fr-FR') : 'N/A'}</p>
                      <p><span className="font-medium">ID utilisateur:</span> {userItem?.id}</p>
                    </div>
                  ) : (
                    <p>Un email de bienvenue sera envoyé à l&apos;utilisateur après la création du compte.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {modalType === 'order' && orderItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Commande</label>
                  <input
                    type="text"
                    readOnly
                    value={`#${orderItem.id}`}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total (DH)</label>
                  <input
                    type="number"
                    name="total_amount"
                    step="0.01"
                    defaultValue={orderItem.total_amount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    name="status"
                    defaultValue={orderItem.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                  >
                    <option value="pending">En attente (Pending)</option>
                    <option value="paid">Payée (Paid)</option>
                    <option value="shipped">Expédiée (Shipped)</option>
                    <option value="delivered">Livrée (Delivered)</option>
                    <option value="canceled">Annulée (Canceled)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de Paiement</label>
                  <input
                    type="text"
                    readOnly
                    value={orderItem.payment_method || 'N/A'}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Détails de Livraison</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                    <input
                      type="text"
                      name="full_name"
                      defaultValue={parsedAddress?.full_name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="text"
                        name="phone"
                        defaultValue={parsedAddress?.phone || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                      <input
                        type="text"
                        name="city"
                        defaultValue={parsedAddress?.city || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <textarea
                      name="address"
                      rows={2}
                      defaultValue={parsedAddress?.address || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500">
                <p>Passée le: {orderItem.placed_at ? new Date(orderItem.placed_at).toLocaleString('fr-FR') : 'N/A'}</p>
                <p>Client ID: {orderItem.user_id}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 disabled:opacity-50 text-sm"
            >
              <Save size={14} />
              <span>{loading ? 'Sauvegarde...' : (isEditing ? 'Mettre à jour' : 'Créer')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;