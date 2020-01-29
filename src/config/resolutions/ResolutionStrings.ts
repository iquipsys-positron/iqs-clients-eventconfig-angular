
{
    function declareResolutionsTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            RESOLUTION: 'Resolution',
            RESOLUTIONS: 'Resolutions',
            RESOLUTION_LABEL: 'Resolution',
            RESOLUTION_DEFAULT_LABEL: 'Set as default',
            RESOLUTION_RULES_LABEL: 'For incidents',
            RESOLUTION_NEW_RESOLUTION: 'New resolution',
            RESOLUTION_DEFAULT_TEXT: 'Default',
            RESOLUTION_DEFAULT_LIST_TEXT: 'Set as default',
            RESOLUTION_EMPTY_TITLE: 'Resolutions were not found',
            RESOLUTION_EMPTY_SUBTITLE: 'The resolution is a standard phase to respond to an incident for reporting',
            RESOLUTION_EMPTY_ADD_BUTTON: 'Add resolution',
            RESOLUTION_LOADING_TITLE: 'Loading resolutions...',
            RESOLUTIONS_RULES_EMPTY: 'Applicable events are absent',
            RESOLUTIONS_RULES_EMPTY_BUTTON: 'Select Incidents',
            RESOLUTION_DETAILS: 'Resolution',
            RESOLUTION_DETAILS_NEW: 'New resolution',
            RESOLUTION_DETAILS_EDIT: 'Edit resolution',
            RESOLUTION_SAVE: 'Save',
            RESOLUTION_CANCEL: 'Cancel',
            RESOLUTION_EDIT: 'Edit',
            RESOLUTION_DELETE: 'Delete',
            RESOLUTION_ERROR_RULES_EMPTY: 'At least one rule shall be set',
            RESOLUTION_DELETE_CONFIRMATION_TITLE: 'Delete the resolution',
            RESOLUTION_SEVERITY_LABEL: 'Importance',
            RESOLUTION_EVENT_RULE_SELECT_ALL: 'Select all',
            RESOLUTION_CHECK_LABEL: 'Select incidents for which resolution is applied',
            RESOLUTION_RULES_APLAY_ALL_LABEL: 'The resolution applies to all incidents'
        });
        pipTranslateProvider.translations('ru', {
            RESOLUTION: 'Резолюция',
            RESOLUTIONS: 'Резолюции',
            RESOLUTION_LABEL: 'Резолюция',
            RESOLUTION_DEFAULT_LABEL: 'По умолчанию',
            RESOLUTION_RULES_LABEL: 'Для происшествий',
            RESOLUTION_NEW_RESOLUTION: 'Новая резолюция',
            RESOLUTION_DEFAULT_TEXT: 'По умолчанию',
            RESOLUTION_DEFAULT_LIST_TEXT: 'По умолчанию',
            RESOLUTION_EMPTY_TITLE: 'Резолюции не найдены',
            RESOLUTION_EMPTY_SUBTITLE: 'Резолюция определяет стандартную формулу описывающую реакцию на происшествие для отчетности',
            RESOLUTION_EMPTY_ADD_BUTTON: 'Добавить резолюцию',
            RESOLUTION_LOADING_TITLE: 'Загрузка резолюций',
            RESOLUTIONS_RULES_EMPTY: 'Применяемые происшествия отсутствуют',
            RESOLUTIONS_RULES_EMPTY_BUTTON: 'Выбрать происшествия',
            RESOLUTION_DETAILS: 'Резолюция',
            RESOLUTION_DETAILS_NEW: 'Новая резолюция',
            RESOLUTION_DETAILS_EDIT: 'Редактирование резолюции',
            RESOLUTION_SAVE: 'Сохранить',
            RESOLUTION_CANCEL: 'Отменить',
            RESOLUTION_EDIT: 'Изменить',
            RESOLUTION_DELETE: 'Удалить',
            RESOLUTION_ERROR_RULES_EMPTY: 'Необходимо указать хотя бы одно правило',
            RESOLUTION_DELETE_CONFIRMATION_TITLE: 'Удалить резолюцию',
            RESOLUTION_SEVERITY_LABEL: 'Важность',
            RESOLUTION_EVENT_RULE_SELECT_ALL: 'Выделить все',
            RESOLUTION_CHECK_LABEL: 'Выбрать происшествия, для которых подходит резолюция',
            RESOLUTION_RULES_APLAY_ALL_LABEL: 'Резолюция применяется ко всем происшествиям'

        });
    }

    angular
        .module('iqsConfigResolutions')
        .config(declareResolutionsTranslateResources);
}