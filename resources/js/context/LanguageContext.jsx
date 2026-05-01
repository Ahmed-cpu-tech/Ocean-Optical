import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    fr: {
        home: 'Accueil',
        products: 'Nos Modèles',
        prescriptions: 'Ordonnances',
        contact: 'Contactez-nous',
        admin: 'Administration',
        slogan: 'Voir plus. Vivre plus.',
        latest_products: 'Derniers Modèles',
        view_details: 'Voir Détails',
        send_prescription: 'Envoyer Ordonnance',
        submit: 'Soumettre',
        name: 'Nom',
        email: 'Email',
        message: 'Message',
        phone: 'Téléphone',
        login: 'Connexion',
        logout: 'Déconnexion',
        all: 'Tous',
        medical: 'Médical',
        sunglasses: 'Solaire',
        price: 'Prix',
        new_model: 'Nouveau',
        dashboard: 'Tableau de Bord',
        add_product: 'Ajouter Produit',
    },
    ar: {
        home: 'الرئيسية',
        products: 'نظاراتنا',
        prescriptions: 'الوصفات الطبية',
        contact: 'اتصل بنا',
        admin: 'الإدارة',
        slogan: 'رؤية أفضل. حياة أفضل.',
        latest_products: 'أحدث الموديلات',
        view_details: 'عرض التفاصيل',
        send_prescription: 'إرسال وصفة',
        submit: 'إرسال',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        message: 'الرسالة',
        phone: 'الهاتف',
        login: 'تسجيل الدخول',
        logout: 'تسجيل الخروج',
        all: 'الكل',
        medical: 'طبي',
        sunglasses: 'شمسي',
        price: 'السعر',
        new_model: 'جديد',
        dashboard: 'لوحة التحكم',
        add_product: 'إضافة منتج',
    }
};

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr');

    useEffect(() => {
        localStorage.setItem('lang', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [lang]);

    const t = (key) => translations[lang][key] || key;

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
