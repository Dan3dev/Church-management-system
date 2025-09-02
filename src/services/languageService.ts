export class LanguageService {
  private static instance: LanguageService;
  private translations: Map<string, { [key: string]: string }> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  static getInstance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService();
    }
    return LanguageService.instance;
  }

  // Event system for real-time updates
  addEventListener(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => callback(data));
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
          'test': 'Test',
          'send': 'Send',
          'schedule': 'Schedule',

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
          'syncSuccess': 'Synchronization completed successfully',
          'languageChanged': 'Language changed successfully',
          'currencyChanged': 'Currency changed successfully',
          'integrationConnected': 'Integration connected successfully',
          'integrationDisconnected': 'Integration disconnected',
          'exchangeRatesUpdated': 'Exchange rates updated',
          'translationsLoaded': 'Translations loaded',

          // Specific UI Elements
          'totalMembers': 'Total Members',
          'activeMembers': 'Active Members',
          'monthlyIncome': 'Monthly Income',
          'weeklyAttendance': 'Weekly Attendance',
          'upcomingEvents': 'Upcoming Events',
          'recentActivity': 'Recent Activity',
          'quickActions': 'Quick Actions',
          'addNewMember': 'Add New Member',
          'recordAttendance': 'Record Attendance',
          'addTransaction': 'Add Transaction',
          'scheduleEvent': 'Schedule Event',
          'sendCommunication': 'Send Communication',
          'generateReport': 'Generate Report'
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
          'test': 'Probar',
          'send': 'Enviar',
          'schedule': 'Programar',

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
          'syncSuccess': 'Sincronización completada exitosamente',
          'languageChanged': 'Idioma cambiado exitosamente',
          'currencyChanged': 'Moneda cambiada exitosamente',

          // Specific UI Elements
          'totalMembers': 'Total de Miembros',
          'activeMembers': 'Miembros Activos',
          'monthlyIncome': 'Ingresos Mensuales',
          'weeklyAttendance': 'Asistencia Semanal',
          'upcomingEvents': 'Próximos Eventos',
          'recentActivity': 'Actividad Reciente',
          'quickActions': 'Acciones Rápidas',
          'addNewMember': 'Agregar Nuevo Miembro',
          'recordAttendance': 'Registrar Asistencia',
          'addTransaction': 'Agregar Transacción',
          'scheduleEvent': 'Programar Evento',
          'sendCommunication': 'Enviar Comunicación',
          'generateReport': 'Generar Informe'
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
          'test': 'Tester',
          'send': 'Envoyer',
          'schedule': 'Programmer',

          // Messages
          'welcome': 'Bienvenue à ChurchHub',
          'loading': 'Chargement...',
          'noData': 'Aucune donnée disponible',
          'success': 'Succès',
          'error': 'Erreur',
          'warning': 'Avertissement',
          'info': 'Information',
          'saveSuccess': 'Modifications enregistrées avec succès',
          'connectionSuccess': 'Connexion établie avec succès',
          'languageChanged': 'Langue changée avec succès',
          'currencyChanged': 'Devise changée avec succès'
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
          'connect': 'Unganisha',
          'disconnect': 'Tenganisha',
          'sync': 'Sawazisha',
          'test': 'Jaribu',
          'send': 'Tuma',

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
          'error': 'Hitilafu',
          'languageChanged': 'Lugha imebadilishwa kwa mafanikio',
          'currencyChanged': 'Sarafu imebadilishwa kwa mafanikio'
        },

        ar: {
          // Navigation (Arabic - RTL)
          'dashboard': 'لوحة التحكم',
          'members': 'الأعضاء',
          'families': 'العائلات',
          'attendance': 'الحضور',
          'finance': 'المالية',
          'accounts': 'الحسابات',
          'events': 'الأحداث',
          'reports': 'التقارير',
          'giving': 'التبرعات',
          'volunteers': 'المتطوعون',
          'communication': 'التواصل',
          'children': 'الأطفال',
          'sermons': 'الخطب',
          'smallgroups': 'المجموعات الصغيرة',
          'ministries': 'الخدمات',
          'campuses': 'الحرم الجامعي',
          'documents': 'الوثائق',
          'users': 'إدارة المستخدمين',
          'profile': 'الملف الشخصي',
          'settings': 'الإعدادات',

          // Common Actions
          'save': 'حفظ',
          'cancel': 'إلغاء',
          'delete': 'حذف',
          'edit': 'تعديل',
          'add': 'إضافة',
          'create': 'إنشاء',
          'export': 'تصدير',
          'search': 'بحث',
          'filter': 'تصفية',
          'connect': 'اتصال',
          'disconnect': 'قطع الاتصال',
          'sync': 'مزامنة',
          'test': 'اختبار',
          'send': 'إرسال',

          // Common Fields
          'name': 'الاسم',
          'email': 'البريد الإلكتروني',
          'phone': 'الهاتف',
          'address': 'العنوان',
          'date': 'التاريخ',
          'amount': 'المبلغ',
          'total': 'المجموع',
          'active': 'نشط',
          'inactive': 'غير نشط',

          // Messages
          'welcome': 'مرحباً بك في ChurchHub',
          'loading': 'جاري التحميل...',
          'success': 'نجح',
          'error': 'خطأ',
          'languageChanged': 'تم تغيير اللغة بنجاح',
          'currencyChanged': 'تم تغيير العملة بنجاح'
        },

        zh: {
          // Navigation (Chinese Simplified)
          'dashboard': '仪表板',
          'members': '成员',
          'families': '家庭',
          'attendance': '出席',
          'finance': '财务',
          'accounts': '账户',
          'events': '活动',
          'reports': '报告',
          'giving': '奉献',
          'volunteers': '志愿者',
          'communication': '沟通',
          'children': '儿童',
          'sermons': '讲道',
          'smallgroups': '小组',
          'ministries': '事工',
          'campuses': '校园',
          'documents': '文档',
          'users': '用户管理',
          'profile': '个人资料',
          'settings': '设置',

          // Common Actions
          'save': '保存',
          'cancel': '取消',
          'delete': '删除',
          'edit': '编辑',
          'add': '添加',
          'create': '创建',
          'export': '导出',
          'search': '搜索',
          'filter': '筛选',
          'connect': '连接',
          'disconnect': '断开连接',
          'sync': '同步',
          'test': '测试',
          'send': '发送',

          // Messages
          'welcome': '欢迎使用 ChurchHub',
          'loading': '加载中...',
          'success': '成功',
          'error': '错误',
          'languageChanged': '语言更改成功',
          'currencyChanged': '货币更改成功'
        }
      };

      const translations = allTranslations[languageCode] || allTranslations['en'];
      this.translations.set(languageCode, translations);
      this.emit('translationsLoaded', { languageCode, count: Object.keys(translations).length });
      
      return translations;
    } catch (error) {
      console.error('Failed to load translations:', error);
      this.emit('translationsError', { languageCode, error });
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
    
    // Emit update event for real-time UI updates
    this.emit('translationsUpdated', { languageCode, translations: updated });
    
    // In production, save to backend
    console.log(`Updated translations for ${languageCode}:`, newTranslations);
  }

  exportTranslations(languageCode: string): void {
    const translations = this.translations.get(languageCode) || {};
    const blob = new Blob([JSON.stringify(translations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translations_${languageCode}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.emit('translationsExported', { languageCode, count: Object.keys(translations).length });
  }

  async importTranslations(languageCode: string, file: File): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const text = await file.text();
      const translations = JSON.parse(text);
      
      if (typeof translations !== 'object') {
        throw new Error('Invalid translation file format');
      }

      await this.updateTranslations(languageCode, translations);
      this.emit('translationsImported', { languageCode, count: Object.keys(translations).length });
      
      return { success: true, count: Object.keys(translations).length };
    } catch (error) {
      this.emit('translationsImportError', { languageCode, error });
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
      'rw': 'rw-RW',
      'th': 'th-TH',
      'vi': 'vi-VN',
      'id': 'id-ID',
      'ms': 'ms-MY',
      'tl': 'tl-PH',
      'bn': 'bn-BD',
      'ur': 'ur-PK',
      'fa': 'fa-IR',
      'nl': 'nl-NL',
      'sv': 'sv-SE',
      'no': 'no-NO',
      'da': 'da-DK',
      'fi': 'fi-FI',
      'pl': 'pl-PL',
      'cs': 'cs-CZ',
      'hu': 'hu-HU',
      'ro': 'ro-RO',
      'bg': 'bg-BG',
      'hr': 'hr-HR',
      'sk': 'sk-SK',
      'sl': 'sl-SI',
      'et': 'et-EE',
      'lv': 'lv-LV',
      'lt': 'lt-LT'
    };
    
    return locales[languageCode] || 'en-US';
  }

  // Get language statistics
  getLanguageStats(): { [languageCode: string]: { translationCount: number; completeness: number } } {
    const stats: { [languageCode: string]: { translationCount: number; completeness: number } } = {};
    
    const englishTranslations = this.translations.get('en') || {};
    const totalKeys = Object.keys(englishTranslations).length;
    
    for (const [languageCode, translations] of this.translations.entries()) {
      const translationCount = Object.keys(translations).length;
      const completeness = totalKeys > 0 ? (translationCount / totalKeys) * 100 : 0;
      
      stats[languageCode] = {
        translationCount,
        completeness: Math.round(completeness)
      };
    }
    
    return stats;
  }

  // Get languages by region
  getLanguagesByRegion(): { [region: string]: string[] } {
    return {
      'Europe': ['en', 'es', 'fr', 'pt', 'de', 'it', 'ru', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt'],
      'Africa': ['sw', 'am', 'yo', 'ig', 'ha', 'zu', 'af', 'rw', 'lg', 'om', 'ar'],
      'Asia': ['zh', 'ja', 'ko', 'hi', 'th', 'vi', 'id', 'ms', 'tl', 'bn', 'ur', 'fa', 'ar'],
      'Americas': ['en', 'es', 'pt', 'fr'],
      'Oceania': ['en', 'mi', 'fj', 'to', 'sm']
    };
  }
}

export const languageService = LanguageService.getInstance();