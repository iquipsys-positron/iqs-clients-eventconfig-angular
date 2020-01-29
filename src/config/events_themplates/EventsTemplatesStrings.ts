
{
    function declareEventThemplatesTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            EVENTS_TEMPLATES: 'Event templates',
            EVENTS_TEMPLATES_LABEL: 'Event name',
            EVENTS_TEMPLATES_SET_TIME_LABEL: 'Allow to set time',
            EVENTS_TEMPLATES_SET_OBJECT_LABEL: 'Set objects',
            EVENTS_TEMPLATES_SET_POS_LABEL: 'Set position',
            EVENTS_TEMPLATES_EMPTY_TITLE: 'Event templates were not found',
            EVENTS_TEMPLATES_EMPTY_SUBTITLE: 'Templates help to speed up manual entry of events into the journal for reporting',
            EVENTS_TEMPLATES_EMPTY_ADD_BUTTON: 'Add event template',
            EVENTS_TEMPLATES_LOADING_TITLE: 'Loading event templates',
            EVENTS_TEMPLATES_NEW_DESCRIPTION: 'New event template',
            EVENTS_TEMPLATES_DETAILS: 'Event template',
            EVENTS_TEMPLATES_DETAILS_NEW: 'New event template',
            EVENTS_TEMPLATES_DETAILS_EDIT: 'Edit event template',
            EVENTS_TEMPLATES_SAVE: 'Save',
            EVENTS_TEMPLATES_CANCEL: 'Cancel',         
            EVENTS_TEMPLATES_EDIT: 'Edit',
            EVENTS_TEMPLATES_DELETE: 'Delete',
            EVENT_TEMPLATES_DELETE_CONFIRMATION_TITLE: 'Delete the event templete',
            EVENT_TEMPLATES_SEVERITY_LABEL: 'Importance'     
        });
        pipTranslateProvider.translations('ru', {
            EVENTS_TEMPLATES: 'Шаблоны событий',
            EVENTS_TEMPLATES_LABEL: 'Название события',
            EVENTS_TEMPLATES_SET_TIME_LABEL: 'Позволить изменять время',
            EVENTS_TEMPLATES_SET_OBJECT_LABEL: 'Определить объекты',
            EVENTS_TEMPLATES_SET_POS_LABEL: 'Определить позицию',
            EVENTS_TEMPLATES_EMPTY_TITLE: 'Шаблоны событий не найдены',
            EVENTS_TEMPLATES_EMPTY_SUBTITLE: 'Шаблоны позволяют ускорить ручной ввод событий в журнал для отчетности',
            EVENTS_TEMPLATES_EMPTY_ADD_BUTTON: 'Добавить шаблон для события',
            EVENTS_TEMPLATES_LOADING_TITLE: 'Загрузка шаблонов событий',
            EVENTS_TEMPLATES_NEW_DESCRIPTION: 'Новый шаблон события',
            EVENTS_TEMPLATES_DETAILS: 'Шаблон события',
            EVENTS_TEMPLATES_DETAILS_NEW: 'Новый шаблон события',
            EVENTS_TEMPLATES_DETAILS_EDIT: 'Редактирование шаблона события',   
            EVENTS_TEMPLATES_SAVE: 'Сохранить',
            EVENTS_TEMPLATES_CANCEL: 'Отменить',         
            EVENTS_TEMPLATES_EDIT: 'Изменить',
            EVENTS_TEMPLATES_DELETE: 'Удалить',
            EVENT_TEMPLATES_DELETE_CONFIRMATION_TITLE: 'Удалить шаблон события',
            EVENT_TEMPLATES_SEVERITY_LABEL: 'Важность' 
        });
    }

    angular
        .module('iqsConfigEventsTemplates')
        .config(declareEventThemplatesTranslateResources);
}
