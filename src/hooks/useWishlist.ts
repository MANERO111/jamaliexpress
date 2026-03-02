import { useState, useEffect } from 'react';

export const useWishlist = () => {
    const [wishlist, setWishlist] = useState<number[]>([]);

    useEffect(() => {
        const loadWishlist = () => {
            try {
                const saved = localStorage.getItem('wishlist');
                if (saved) {
                    setWishlist(JSON.parse(saved));
                } else {
                    setWishlist([]);
                }
            } catch (error) {
                console.error('Error loading wishlist:', error);
            }
        };

        loadWishlist();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'wishlist') loadWishlist();
        };

        // Listen for custom event for same-tab updates
        const handleCustomEvent = () => loadWishlist();

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('wishlistUpdated', handleCustomEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('wishlistUpdated', handleCustomEvent);
        };
    }, []);

    const toggleWishlist = (productId: number) => {
        try {
            const saved = localStorage.getItem('wishlist');
            const currentWishlist: number[] = saved ? JSON.parse(saved) : [];

            let newWishlist;
            if (currentWishlist.includes(productId)) {
                newWishlist = currentWishlist.filter(id => id !== productId);
            } else {
                newWishlist = [...currentWishlist, productId];
            }

            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            setWishlist(newWishlist);

            // Dispatch event for other components
            window.dispatchEvent(new Event('wishlistUpdated'));
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

    const isInWishlist = (productId: number) => wishlist.includes(productId);

    return { wishlist, toggleWishlist, isInWishlist };
};
