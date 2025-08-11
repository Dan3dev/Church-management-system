export class LanguageService {
  private static instance: LanguageService;
  private translations: Map<string, { [key: string]: string }> = new Map();

  static getInstance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService();
    }
    return LanguageService.instance;
  }

  async loadTranslations(languageCode: string): Promise<{ [key: string]: string }> {
    try {
      // In production, load from API or files
      // const response = await fetch(`/translations/${languageCode}.json`);
      // return await response.json();

      // Comprehensive translations for multiple languages
      const allTranslations: { [key: string]: { [key: string]: string } } = {
        en: {
          // Navigation
          'dashboard': 'Dashboard',
          'members': 'Members',
          'families': 'Families',
          'attendance': 'Attendance',
          'finance': 'Finance',
          'accounts': 'Accounts',
          'events': 'Events',
          'reports': 'Reports',
          'giving': 'Giving',
          'volunteers': 'Volunteers',
          'communication': 'Communication',
          'children': 'Children',
          'sermons': 'Sermons',
          'smallgroups': 'Small Groups',
          'ministries': 'Ministries',
          'campuses': 'Campuses',
          'documents': 'Documents',
          'users': 'User Management',
          'profile': 'Profile',
          'settings': 'Settings',
          'ai-insights': 'AI Insights',
          'integrations': 'Integrations',
          'languages': 'Languages',
          'currencies': 'Currencies',

          // Common Actions
          'save': 'Save',
          'cancel': 'Cancel',
          'delete': 'Delete',
          'edit': 'Edit',
          'add': 'Add',
          'create': 'Create',
          'update': 'Update',
          'export': 'Export',
          'import': 'Import',
          'search': 'Search',
          'filter': 'Filter',
          'view': 'View',
          'download': 'Download',
          'upload': 'Upload',
          'connect': 'Connect',
          'disconnect': 'Disconnect',
          'sync': 'Sync',
          'refresh': 'Refresh',

          // Common Fields
          'name': 'Name',
          'email': 'Email',
          'phone': 'Phone',
          'address': 'Address',
          'date': 'Date',
          'time': 'Time',
          'amount': 'Amount',
          'description': 'Description',
          'status': 'Status',
          'type': 'Type',
          'category': 'Category',
          'notes': 'Notes',
          'total': 'Total',
          'active': 'Active',
          'inactive': 'Inactive',
          'pending': 'Pending',
          'completed': 'Completed',
          'cancelled': 'Cancelled',

          // Member Fields
          'firstName': 'First Name',
          'lastName': 'Last Name',
          'dateOfBirth': 'Date of Birth',
          'membershipStatus': 'Membership Status',
          'joinDate': 'Join Date',
          'ministry': 'Ministry',
          'campus': 'Campus',
          'emergencyContact': 'Emergency Contact',

          // Financial Terms
          'income': 'Income',
          'expense': 'Expense',
          'balance': 'Balance',
          'budget': 'Budget',
          'transaction': 'Transaction',
          'account': 'Account',
          'currency': 'Currency',
          'exchangeRate': 'Exchange Rate',

          // Messages
          'welcome': 'Welcome to ChurchHub',
          'loading': 'Loading...',
          'noData': 'No data available',
          'success': 'Success',
          'error': 'Error',
          'warning': 'Warning',
          'info': 'Information',
          'confirmDelete': 'Are you sure you want to delete this item?',
          'saveSuccess': 'Changes saved successfully',
          'deleteSuccess': 'Item deleted successfully',
          'exportSuccess': 'Export completed successfully',
          'connectionSuccess': 'Connection established successfully',
          'syncSuccess': 'Synchronization completed successfully'
        },

        es: {
          // Navigation
          'dashboard': 'Panel de Control',
          'members': 'Miembros',
          'families': 'Familias',
          'attendance': 'Asistencia',
          'finance': 'Finanzas',
          'accounts': 'Cuentas',
          'events': 'Eventos',
          'reports': 'Informes',
          'giving': 'Ofrendas',
          'volunteers': 'Voluntarios',
          'communication': 'Comunicación',
          'children': 'Niños',
          'sermons': 'Sermones',
          'smallgroups': 'Grupos Pequeños',
          'ministries': 'Ministerios',
          'campuses': 'Campus',
          'documents': 'Documentos',
          'users': 'Gestión de Usuarios',
          'profile': 'Perfil',
          'settings': 'Configuración',
          'ai-insights': 'Perspectivas IA',
          'integrations': 'Integraciones',
          'languages': 'Idiomas',
          'currencies': 'Monedas',

          // Common Actions
          'save': 'Guardar',
          'cancel': 'Cancelar',
          'delete': 'Eliminar',
          'edit': 'Editar',
          'add': 'Agregar',
          'create': 'Crear',
          'update': 'Actualizar',
          'export': 'Exportar',
          'import': 'Importar',
          'search': 'Buscar',
          'filter': 'Filtrar',
          'view': 'Ver',
          'download': 'Descargar',
          'upload': 'Subir',
          'connect': 'Conectar',
          'disconnect': 'Desconectar',
          'sync': 'Sincronizar',
          'refresh': 'Actualizar',

          // Common Fields
          'name': 'Nombre',
          'email': 'Correo Electrónico',
          'phone': 'Teléfono',
          'address': 'Dirección',
          'date': 'Fecha',
          'time': 'Hora',
          'amount': 'Cantidad',
          'description': 'Descripción',
          'status': 'Estado',
          'type': 'Tipo',
          'category': 'Categoría',
          'notes': 'Notas',
          'total': 'Total',
          'active': 'Activo',
          'inactive': 'Inactivo',
          'pending': 'Pendiente',
          'completed': 'Completado',
          'cancelled': 'Cancelado',

          // Messages
          'welcome': 'Bienvenido a ChurchHub',
          'loading': 'Cargando...',
          'noData': 'No hay datos disponibles',
          'success': 'Éxito',
          'error': 'Error',
          'warning': 'Advertencia',
          'info': 'Información',
          'confirmDelete': '¿Está seguro de que desea eliminar este elemento?',
          'saveSuccess': 'Cambios guardados exitosamente',
          'deleteSuccess': 'Elemento eliminado exitosamente',
          'exportSuccess': 'Exportación completada exitosamente',
          'connectionSuccess': 'Conexión establecida exitosamente',
          'syncSuccess': 'Sincronización completada exitosamente'
        },

        fr: {
          // Navigation
          'dashboard': 'Tableau de Bord',
          'members': 'Membres',
          'families': 'Familles',
          'attendance': 'Présence',
          'finance': 'Finance',
          'accounts': 'Comptes',
          'events': 'Événements',
          'reports': 'Rapports',
          'giving': 'Dons',
          'volunteers': 'Bénévoles',
          'communication': 'Communication',
          'children': 'Enfants',
          'sermons': 'Sermons',
          'smallgroups': 'Petits Groupes',
          'ministries': 'Ministères',
          'campuses': 'Campus',
          'documents': 'Documents',
          'users': 'Gestion des Utilisateurs',
          'profile': 'Profil',
          'settings': 'Paramètres',
          'ai-insights': 'Insights IA',
          'integrations': 'Intégrations',
          'languages': 'Langues',
          'currencies': 'Devises',

          // Common Actions
          'save': 'Enregistrer',
          'cancel': 'Annuler',
          'delete': 'Supprimer',
          'edit': 'Modifier',
          'add': 'Ajouter',
          'create': 'Créer',
          'update': 'Mettre à jour',
          'export': 'Exporter',
          'import': 'Importer',
          'search': 'Rechercher',
          'filter': 'Filtrer',
          'view': 'Voir',
          'download': 'Télécharger',
          'upload': 'Téléverser',
          'connect': 'Connecter',
          'disconnect': 'Déconnecter',
          'sync': 'Synchroniser',
          'refresh': 'Actualiser',

          // Messages
          'welcome': 'Bienvenue à ChurchHub',
          'loading': 'Chargement...',
          'noData': 'Aucune donnée disponible',
          'success': 'Succès',
          'error': 'Erreur',
          'warning': 'Avertissement',
          'info': 'Information',
          'saveSuccess': 'Modifications enregistrées avec succès',
          'connectionSuccess': 'Connexion établie avec succès'
        },

        sw: {
          // Navigation
          'dashboard': 'Dashibodi',
          'members': 'Wanachama',
          'families': 'Familia',
          'attendance': 'Mahudhurio',
          'finance': 'Fedha',
          'accounts': 'Akaunti',
          'events': 'Matukio',
          'reports': 'Ripoti',
          'giving': 'Michango',
          'volunteers': 'Wajitoleaji',
          'communication': 'Mawasiliano',
          'children': 'Watoto',
          'sermons': 'Mahubiri',
          'smallgroups': 'Vikundi Vidogo',
          'ministries': 'Huduma',
          'campuses': 'Kampasi',
          'documents': 'Hati',
          'users': 'Usimamizi wa Watumiaji',
          'profile': 'Wasifu',
          'settings': 'Mipangilio',

          // Common Actions
          'save': 'Hifadhi',
          'cancel': 'Ghairi',
          'delete': 'Futa',
          'edit': 'Hariri',
          'add': 'Ongeza',
          'create': 'Unda',
          'export': 'Hamisha',
          'search': 'Tafuta',
          'filter': 'Chuja',

          // Common Fields
          'name': 'Jina',
          'email': 'Barua Pepe',
          'phone': 'Simu',
          'address': 'Anwani',
          'date': 'Tarehe',
          'amount': 'Kiasi',
          'total': 'Jumla',
          'active': 'Hai',
          'inactive': 'Haifanyi',

          // Messages
          'welcome': 'Karibu ChurchHub',
          'loading': 'Inapakia...',
          'success': 'Mafanikio',
          'error': 'Hitilafu'
        }
      };

      const translations = allTranslations[languageCode] || allTranslations['en'];
      this.translations.set(languageCode, translations);
      return translations;
    } catch (error) {
      console.error('Failed to load translations:', error);
      return this.translations.get('en') || {};
    }
  }

  getTranslation(key: string, languageCode: string): string {
    const translations = this.translations.get(languageCode);
    return translations?.[key] || key;
  }

  async updateTranslations(languageCode: string, newTranslations: { [key: string]: string }): Promise<void> {
    const existing = this.translations.get(languageCode) || {};
    const updated = { ...existing, ...newTranslations };
    this.translations.set(languageCode, updated);
    
    // In production, save to backend
    console.log(`Updated translations for ${languageCode}:`, newTranslations);
  }

  exportTranslations(languageCode: string): void {
    const translations = this.translations.get(languageCode) || {};
    const blob = new Blob([JSON.stringify(translations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translations_${languageCode}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async importTranslations(languageCode: string, file: File): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const text = await file.text();
      const translations = JSON.parse(text);
      
      if (typeof translations !== 'object') {
        throw new Error('Invalid translation file format');
      }

      await this.updateTranslations(languageCode, translations);
      return { success: true, count: Object.keys(translations).length };
    } catch (error) {
      return { success: false, error: 'Failed to import translations' };
    }
  }

  getLanguageDirection(languageCode: string): 'ltr' | 'rtl' {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
  }

  getLanguageLocale(languageCode: string): string {
    const locales: { [key: string]: string } = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'pt': 'pt-BR',
      'de': 'de-DE',
      'it': 'it-IT',
      'ru': 'ru-RU',
      'ar': 'ar-SA',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'hi': 'hi-IN',
      'sw': 'sw-KE',
      'am': 'am-ET',
      'yo': 'yo-NG',
      'ig': 'ig-NG',
      'ha': 'ha-NG',
      'zu': 'zu-ZA',
      'af': 'af-ZA',
      'rw': 'rw-RW'
    };
    
    return locales[languageCode] || 'en-US';
  }
}

export const languageService = LanguageService.getInstance();