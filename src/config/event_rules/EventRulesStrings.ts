
{
    function declareEventRulesTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            RULES: 'Rules',
            RULE: 'Rule',

            RULES_SEARCH_PLACEHOLDER: 'Search rules ...',

            RULES_LOADING_TITLE: 'Loading rules',
            RULES_EMPTY_ADD_BUTTON: 'Add rule',
            RULES_EMPTY_SUBTITLE: 'Rules allow you to evaluate the behavior of objects, record events, and, in special cases, report incidents for corrective actions.',
            RULES_EMPTY_TITLE: 'Rules not found',

            EVENT_RULE_NEW_RULE: 'New rule',
            EVENT_RULE_DETAILS: 'Rule',
            EVENT_RULE_DETAILS_NEW: 'Adding a Rule',
            EVENT_RULE_DETAILS_EDIT: 'Editing a Rule',
            EVENT_RULE_NEW_NAME: 'New rule',

            RULES_INCLUDE_OBJECT: 'Include objects',
            RULES_EXCLUDE_OBJECT: 'Exclude objects',
            RULES_INCLUDE_ZONE: 'Include Zones',
            RULES_EXCLUDE_ZONE: 'Exclude zones',

            RULES_TAB_CONDITIONAL: 'Condition',
            RULES_TAB_ACTIONS: 'Actions',
            RULES_TAB_INFORMATION: 'Conditions',
            RULES_TAB_OBJECTS: 'Objects',
            RULES_TAB_ZONES: 'Zones',

            RULES_INCLUDE_ZONES_LABEL: 'Selected zones',
            RULES_INCLUDE_ZONES_EMPTY_LABEL: 'No zone selected',
            RULES_INCLUDE_ZONES_EMPTY_LABEL_ALL: 'Active everywhere',
            RULES_EXCLUDE_ZONES_LABEL: 'Excluding zones',

            RULES_INCLUDE_OBJECTS_LABEL: 'Selected objects or groups',
            RULES_INCLUDE_OBJECTS_EMPTY_LABEL: 'No object selected',
            RULES_INCLUDE_OBJECTS_EMPTY_LABEL_ALL: 'Active for all',
            RULES_EXCLUDE_OBJECTS_LABEL: 'Excluding objects or groups',

            RULES_INTERVAL_LABEL: 'interval each',
            RULES_INTERVAL_MEASURE_LABEL: 'sec',

            EVENT_RULE_CONDITIONAL_BETWEEN_NAME: '',
            EVENT_RULE_CONDITIONAL_MAX_NAME: '',
            EVENT_RULE_CONDITIONAL_MIN_NAME: '',
            EVENT_RULE_CONDITIONAL_DURATION_NAME: '',

            RULES_ACTION_SIGNAL_TITLE: 'Send signal to tracker',
            RULES_ACTION_SIGNAL_SUBTITLE: 'buzzer',
            RULES_ACTION_EMAIL_TITLE: 'Send message by email',
            RULES_ACTION_INCIDENT_TITLE: 'Notify about incident',
            RULES_ACTION_INCIDENT_SUBTITLE: 'Request a resolution',
            RULES_ACTION_REGISTRY_TITLE: 'Registry event',
            RULES_ACTION_REGISTRY_SUBTITLE: 'Show in journal',

            RULES_ZONES_INCLUDE_TITLE: 'Include zones',
            RULES_ZONES_EXCLUDE_TITLE: 'Exclude zones',
            RULES_OBJECT_INCLUDE_TITLE: 'Add objects or groups',
            RULES_OBJECT_EXCLUDE_TITLE: 'Exclude objects or groups',

            EVENT_RULE_NAME_LABEL: 'Rule name',
            EVENT_RULE_SEVERITY_LABEL: 'Importance',
            EVENT_RULE_INTERVAL_LABEL: 'Operation interval (sec)',
            EVENT_RULE_TYPE_LABEL: 'Condition type',

            RULES_REGISTRY_EVENT_LABEL: 'Registry event',
            EVENT_RULE_INCIDENT_LABEL: 'Notify about incident',
            EVENT_RULE_SEND_SIGNAL_LABEL: 'Send a signal to the tracker',
            EVENT_RULE_SIGNAL_COUNT_LABEL: 'Number of buzzers',
            EVENT_RULE_SEND_EMAILS_LABEL: 'Send message by email',
            EVENT_RULE_EMAILS_LABEL: 'Email address(es)',
            EVENT_RULE_SAVE: 'Save',
            EVENT_RULE_CANCEL: 'Cancel',
            EVENT_RULE_EDIT: 'Edit',
            EVENT_RULE_DELETE: 'Delete',
            EVENT_RULE_DELETE_CONFIRMATION_TITLE: 'Delete the rule',

            EVENT_RULE_DIALOG_INCLUDE_ADD: 'Include',
            EVENT_RULE_DIALOG_EXCLUDE_ADD: 'Exclude',

            RULES_ACTION_EMPTY_LABEL: 'No actions set',
            RULES_ACTION_EMPTY_BUTTON: 'Set actions',


            RULES_ACTIONS_LABEL: 'Actions when rule is triggered',

            EVENT_RULE_SELECT_TYPE_PLACEHOLDER: 'Select the rule type',

            EVENT_RULE_NAME_REQUIRED_ERROR: 'Enter a rule name',
            EVENT_RULE_TYPE_REQUIRED_ERROR: 'Select the rule type',

            EVENT_RULE_CONDITIONAL_MAX_SPEED_REQUIRED_ERROR: 'Enter the maximum speed',
            EVENT_RULE_CONDITIONAL_MAX_SPEED_NOTVALID_ERROR: 'The value is not a number or greater than maximum (999)',

            EVENT_RULE_CONDITIONAL_MIN_SPEED_REQUIRED_ERROR: 'Enter the minimum speed',
            EVENT_RULE_CONDITIONAL_MIN_SPEED_NOTVALID_ERROR: 'The value is not a number or greater than maximum (999)',


            EVENT_RULE_CONDITIONAL_IMMOBILITY_REQUIRED_ERROR: 'Enter the maximum immobility time',
            EVENT_RULE_CONDITIONAL_IMMOBILITY_NOTVALID_ERROR: 'The value is not a number or greater than maximum (999)',

            EVENT_RULE_CONDITIONAL_PRESENCE_REQUIRED_ERROR: 'Enter the maximum presence duraton',
            EVENT_RULE_CONDITIONAL_PRESENCE_NOTVALID_ERROR: 'The entered value is not a number or greater than the allowable value (999)',


            EVENT_RULE_CONDITIONAL_INTERVAL_REQUIRED_ERROR: 'Enter operation interval',
            EVENT_RULE_CONDITIONAL_INTERVAL_NOTVALID_ERROR: 'The value is not a number or greater maximum (9999)',

            EVENT_RULE_SIGNAL_TYPE_LABEL: 'Signal type',
            EVENT_RULE_SELECT_SIGNAL_TYPE_PLACEHOLDER: 'Select signal type',
            EVENT_RULE_SIGNAL_TYPE_REQUIRED_ERROR: 'Specify a signal type',

            EVENT_RULE_EMAILS_REQUIRED_ERROR: 'Enter email address',
            EVENT_RULE_PHONE_VALIDATOR_ERROR: 'Use E.164 to format phone numbers: +xxxxxxxxxxx',
            EVENT_RULE_EMAIL_VALIDATOR_ERROR: 'Use email format: user@example.com',
            EVENT_RULE_SMS_REQUIRED_ERROR: 'Enter phone',
            RULES_ACTION_SMS_TITLE: 'Send SMS',
            EVENT_RULE_SEND_SMS_LABEL: 'Send SMS',
            EVENT_RULE_SMS_LABEL: 'Phone(s) for SMS',
            EVENT_RULE_NAME_UNIQUE_ERROR: 'The rule name must be unique',

            EVENT_RULE_INCLUDE_OBJECT_DESCRIPTION_ALL: 'For all',
            EVENT_RULE_INCLUDE_OBJECT_PREFIX: 'For',
            EVENT_RULE_EXCLUDE_OBJECT_PREFIX: 'Except for',
            RULES_ALL_OBJECTS: 'Apply to all objects',
            RULES_ALL_ZONES: 'Apply to all zone',
            RULES_ACTIONS_EMPTY_LABEL: 'There are no actions',

            EVENT_RULE_SEND_MESSAGES: 'Send message',
            RULES_SEND_MESSAGES_PLACEHOLDER: 'Recipients',
            RULES_ACTION_MESSAGES_TITLE: 'Send message',
            EVENT_RULE_ID: 'System identifier'
        });

        pipTranslateProvider.translations('ru', {
            RULES: 'Правила',
            RULE: 'Правило',
            RULES_SEARCH_PLACEHOLDER: 'Найти правила ...',

            RULES_LOADING_TITLE: 'Правила загружаются',
            RULES_EMPTY_ADD_BUTTON: 'Добавить правило',
            RULES_EMPTY_SUBTITLE: 'Правила позволяют оценивать поведение объектов, регистрировать события, и, в особых случаях, сообщать о происшествиях для корректирующих действий.',
            RULES_EMPTY_TITLE: 'Правила не найдены',

            EVENT_RULE_NEW_RULE: 'Новое правило',
            EVENT_RULE_DETAILS: 'Правило',
            EVENT_RULE_DETAILS_NEW: 'Добавление правила',
            EVENT_RULE_DETAILS_EDIT: 'Редактирование правила',
            EVENT_RULE_NEW_NAME: 'Новое правило',

            RULES_INCLUDE_OBJECT: 'Добавить объекты',
            RULES_EXCLUDE_OBJECT: 'Исключить объекты',
            RULES_INCLUDE_ZONE: 'Добавить зоны',
            RULES_EXCLUDE_ZONE: 'Исключить зоны',

            RULES_TAB_CONDITIONAL: 'Условие',
            RULES_TAB_ACTIONS: 'Действия',
            RULES_TAB_INFORMATION: 'Условия',
            RULES_TAB_OBJECTS: 'Объекты',
            RULES_TAB_ZONES: 'Зоны',

            RULES_INCLUDE_ZONES_LABEL: 'Выбранные зоны',
            RULES_INCLUDE_ZONES_EMPTY_LABEL: 'Нет выбранных зон',
            RULES_INCLUDE_ZONES_EMPTY_LABEL_ALL: 'Активно везде',
            RULES_EXCLUDE_ZONES_LABEL: 'Исключая зоны',

            RULES_INCLUDE_OBJECTS_LABEL: 'Выбранные объекты или группы',
            RULES_INCLUDE_OBJECTS_EMPTY_LABEL: 'Нет выбранных объектов',
            RULES_INCLUDE_OBJECTS_EMPTY_LABEL_ALL: 'Активно для всех',
            RULES_EXCLUDE_OBJECTS_LABEL: 'Исключая объекты или группы',

            RULES_INTERVAL_LABEL: 'интервал каждые',
            RULES_INTERVAL_MEASURE_LABEL: 'сек',

            EVENT_RULE_CONDITIONAL_BETWEEN_NAME: '',
            EVENT_RULE_CONDITIONAL_MAX_NAME: '',
            EVENT_RULE_CONDITIONAL_MIN_NAME: '',
            EVENT_RULE_CONDITIONAL_DURATION_NAME: '',

            RULES_ACTION_SIGNAL_TITLE: 'Послать сигнал на трекер',
            RULES_ACTION_SIGNAL_SUBTITLE: 'Предупреждение',
            RULES_ACTION_EMAIL_TITLE: 'Послать сообщение по эл. почте',
            RULES_ACTION_INCIDENT_TITLE: 'Сообщить о происшествии',
            RULES_ACTION_INCIDENT_SUBTITLE: 'Потребовать резолюцию',
            RULES_ACTION_REGISTRY_TITLE: 'Зарегистрировать событие',
            RULES_ACTION_REGISTRY_SUBTITLE: 'Показать в журнале',



            RULES_ZONES_INCLUDE_TITLE: 'Добавить зоны',
            RULES_ZONES_EXCLUDE_TITLE: 'Исключить зоны',
            RULES_OBJECT_INCLUDE_TITLE: 'Добавить объекты или группы',
            RULES_OBJECT_EXCLUDE_TITLE: 'Исключить объекты или группы',

            EVENT_RULE_NAME_LABEL: 'Название правила',
            EVENT_RULE_SEVERITY_LABEL: 'Важность',
            EVENT_RULE_INTERVAL_LABEL: 'Интервал срабатывания (сек)',
            EVENT_RULE_TYPE_LABEL: 'Тип правила',

            RULES_REGISTRY_EVENT_LABEL: 'Зарегистрировать событие',
            EVENT_RULE_INCIDENT_LABEL: 'Уведомить о происшествии',
            EVENT_RULE_SEND_SIGNAL_LABEL: 'Послать сигнал на трекер',
            EVENT_RULE_SIGNAL_COUNT_LABEL: 'Количество зуммеров',
            EVENT_RULE_SEND_EMAILS_LABEL: 'Послать сообщение по  эл. почте',
            EVENT_RULE_EMAILS_LABEL: 'Адрес(а) эл. почты',
            RULES_ACTION_SMS_TITLE: 'Послать CMC',
            EVENT_RULE_SEND_SMS_LABEL: 'Послать СМС',
            EVENT_RULE_SMS_LABEL: 'Телефон(ы) для СМС',
            EVENT_RULE_SAVE: 'Сохранить',
            EVENT_RULE_CANCEL: 'Отменить',
            EVENT_RULE_EDIT: 'Изменить',
            EVENT_RULE_DELETE: 'Удалить',
            EVENT_RULE_DELETE_CONFIRMATION_TITLE: 'Удалить правило',


            EVENT_RULE_DIALOG_INCLUDE_ADD: 'Добавить',
            EVENT_RULE_DIALOG_EXCLUDE_ADD: 'Исключить',

            RULES_ACTION_EMPTY_LABEL: 'Действия не заданы',
            RULES_ACTION_EMPTY_BUTTON: 'Задать действия',

            RULES_ACTIONS_LABEL: 'Действия при активации правила',

            EVENT_RULE_SELECT_TYPE_PLACEHOLDER: 'Укажите тип правила',

            EVENT_RULE_NAME_REQUIRED_ERROR: 'Введите название правила',
            EVENT_RULE_TYPE_REQUIRED_ERROR: 'Необходимо обязательно выбрать тип правила',

            EVENT_RULE_CONDITIONAL_MAX_SPEED_REQUIRED_ERROR: 'Введите максимальную допустимую скорость',
            EVENT_RULE_CONDITIONAL_MAX_SPEED_NOTVALID_ERROR: 'Введенное значение не является числом или больше допустимого значения (999)',

            EVENT_RULE_CONDITIONAL_MIN_SPEED_REQUIRED_ERROR: 'Введите минимльную допустимую скорость',
            EVENT_RULE_CONDITIONAL_MIN_SPEED_NOTVALID_ERROR: 'Введенное значение не является числом или больше допустимого значения (999)',


            EVENT_RULE_CONDITIONAL_IMMOBILITY_REQUIRED_ERROR: 'Введите максимально допустимое время нахождения в неподвижном состоянии',
            EVENT_RULE_CONDITIONAL_IMMOBILITY_NOTVALID_ERROR: 'Введенное значение не является числом или больше допустимого значения (999)',

            EVENT_RULE_CONDITIONAL_PRESENCE_REQUIRED_ERROR: 'Введите максимально допустимое время пребывания',
            EVENT_RULE_CONDITIONAL_PRESENCE_NOTVALID_ERROR: 'Введенное значение не является числом или больше допустимого значения (999)',


            EVENT_RULE_CONDITIONAL_INTERVAL_REQUIRED_ERROR: 'Введите интервал срабатывания',
            EVENT_RULE_CONDITIONAL_INTERVAL_NOTVALID_ERROR: 'Введенное значение не является числом или больше допустимого значения (9999)',

            EVENT_RULE_SIGNAL_TYPE_LABEL: 'Тип сигнала',
            EVENT_RULE_SELECT_SIGNAL_TYPE_PLACEHOLDER: 'Выберите тип сигнала',
            EVENT_RULE_SIGNAL_TYPE_REQUIRED_ERROR: 'Необходимо указать тип сигнала',

            EVENT_RULE_EMAILS_REQUIRED_ERROR: 'Введите адресс хотя бы одной эл. почты',
            EVENT_RULE_SMS_REQUIRED_ERROR: 'Введите хотя бы один телефон',
            EVENT_RULE_PHONE_VALIDATOR_ERROR: 'Используйте E.164 формат для телефонных номеров: +xxxxxxxxxxx',
            EVENT_RULE_EMAIL_VALIDATOR_ERROR: 'Используйте правильный формат для email: user@example.com',
            EVENT_RULE_NAME_UNIQUE_ERROR: 'Имя правила должно быть уникальным',

            //
            EVENT_RULE_INCLUDE_OBJECT_DESCRIPTION_ALL: 'Для всех',
            EVENT_RULE_INCLUDE_OBJECT_PREFIX: 'Для',
            EVENT_RULE_EXCLUDE_OBJECT_PREFIX: 'Кроме',
            RULES_ALL_OBJECTS: 'Применить ко всем объектам',
            RULES_ALL_ZONES: 'Применить ко всем зонам',
            RULES_ACTIONS_EMPTY_LABEL: 'Нет выбранных действий',

            EVENT_RULE_SEND_MESSAGES: 'Послать сообщение',
            RULES_SEND_MESSAGES_PLACEHOLDER: 'Получатели',
            RULES_ACTION_MESSAGES_TITLE: 'Послать сообщение',
            EVENT_RULE_ID: 'Системный идентификатор'
        });
    }

    angular
        .module('iqsConfigEventRules')
        .config(declareEventRulesTranslateResources);
}
