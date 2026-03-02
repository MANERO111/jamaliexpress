'use client';
import React from 'react';
import { X, Save } from 'lucide-react';
import { Product, Category, Subcategory, SubSubcategory, User, Order } from '@/types/admin';

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
  updateUser
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>(
    (selectedItem && 'category_id' in selectedItem ? (selectedItem as any).category_id?.toString() : '') || ''
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = React.useState<string>(
    (selectedItem && 'subcategory_id' in selectedItem ? (selectedItem as any).subcategory_id?.toString() : '') || ''
  );

  React.useEffect(() => {
    if (selectedItem) {
      setSelectedCategoryId((selectedItem && 'category_id' in selectedItem ? (selectedItem as any).category_id?.toString() : '') || '');
      setSelectedSubCategoryId((selectedItem && 'subcategory_id' in selectedItem ? (selectedItem as any).subcategory_id?.toString() : '') || '');
    } else {
      setSelectedCategoryId('');
      setSelectedSubCategoryId('');
    }
  }, [selectedItem, showModal]);

  if (!showModal) return null;

  const isEditing = selectedItem !== null;

  // Narrowed types for better type safety and to avoid lint errors
  const productItem = modalType === 'product' && selectedItem ? selectedItem as Product : null;
  const categoryItem = modalType === 'category' && selectedItem ? selectedItem as Category : null;
  const subCategoryItem = modalType === 'subcategory' && selectedItem ? selectedItem as Subcategory : null;
  const subSubCategoryItem = modalType === 'sub_subcategory' && selectedItem ? selectedItem as SubSubcategory : null;
  const userItem = modalType === 'user' && selectedItem ? selectedItem as User : null;
  const orderItem = modalType === 'order' && selectedItem ? selectedItem as Order : null;

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
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Modifier' : 'Ajouter'} {
              modalType === 'product' ? 'Produit' :
                modalType === 'category' ? 'Catégorie' :
                  modalType === 'subcategory' ? 'Sous-catégorie' :
                    modalType === 'sub_subcategory' ? 'Sous-sous-catégorie' :
                      modalType === 'user' ? 'Utilisateur' : ''
            }
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {modalType === 'product' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Produit</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={productItem?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                    placeholder="Nom du produit"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                  <input
                    type="text"
                    name="brand"
                    defaultValue={productItem?.brand || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                    placeholder="Marque du produit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={productItem?.slug || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                    placeholder="produit-slug (URL friendly)"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    name="category_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value);
                      setSelectedSubCategoryId('');
                    }}
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sous-catégorie</label>
                  <select
                    name="subcategory_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-400"
                    value={selectedSubCategoryId}
                    onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                    disabled={!selectedCategoryId}
                  >
                    <option value="">Sélectionner une sous-catégorie</option>
                    {subCategories
                      .filter(sc => sc.category_id.toString() === selectedCategoryId)
                      .map(sc => (
                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sous-sous-catégorie</label>
                  <select
                    name="sub_subcategory_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-400"
                    defaultValue={productItem?.sub_subcategory_id || ''}
                    disabled={!selectedSubCategoryId}
                  >
                    <option value="">Sélectionner une sous-sous-catégorie</option>
                    {subSubCategories
                      .filter(ssc => ssc.subcategory_id.toString() === selectedSubCategoryId)
                      .map(ssc => (
                        <option key={ssc.id} value={ssc.id}>{ssc.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix Original (DH)</label>
                  <input
                    type="number"
                    name="original_price"
                    step="0.01"
                    defaultValue={productItem?.original_price || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix Remisé (DH)</label>
                  <input
                    type="number"
                    name="discounted_price"
                    step="0.01"
                    defaultValue={productItem?.discounted_price || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    defaultValue={productItem?.stock_quantity || (productItem as any)?.stock || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    name="status"
                    defaultValue={productItem?.status || 'active'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                  >
                    <option value="active">Actif</option>
                    <option value="draft">Brouillon</option>
                    <option value="out_of_stock">Rupture de Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image du Produit</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                  {productItem?.image_url && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Image actuelle:</span>
                      <a
                        href={productItem.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 underline"
                      >
                        Voir l&apos;image
                      </a>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={productItem?.description || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
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

          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{loading ? 'Sauvegarde...' : (isEditing ? 'Mettre à jour' : 'Créer')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;