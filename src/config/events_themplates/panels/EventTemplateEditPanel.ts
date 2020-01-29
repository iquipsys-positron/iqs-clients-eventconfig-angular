import { EventTemplateParams } from './EventTemplateParams';

interface IEventTemplateEditPanelBindings {
    [key: string]: any;

    onEventTmplSave: any;
    onEventTmplCancel: any;
    newItem: any;
    editItem: any;
    ngDisabled: any;
}

const EventTemplateEditPanelBindings: IEventTemplateEditPanelBindings = {
    // change operational event
    onEventTmplSave: '&iqsSave',
    // add operational event
    onEventTmplCancel: '&iqsCancel',
    // event template for edit
    newItem: '=?iqsNewItem',
    editItem: '=?iqsEditItem',
    ngDisabled: '&?'
}

class EventTemplateEditPanelChanges implements ng.IOnChangesObject, IEventTemplateEditPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onEventTmplSave: ng.IChangesObject<() => ng.IPromise<void>>;
    onEventTmplCancel: ng.IChangesObject<() => ng.IPromise<void>>;
    newItem: ng.IChangesObject<iqs.shell.EventTemplate>;
    editItem: ng.IChangesObject<iqs.shell.EventTemplate>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class EventTemplateEditPanelController implements ng.IController {
    public $onInit() { }
    public eventTemplate: iqs.shell.EventTemplate;


    public newItem: iqs.shell.EventTemplate;
    public editItem: iqs.shell.EventTemplate;
    public onEventTmplSave: (eventTempl: EventTemplateParams) => void;
    public onEventTmplCancel: () => void;
    public ngDisabled: () => boolean;

    public severityCollection: iqs.shell.TypeNumericCollection;
    public cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        $element.addClass('iqs-event-templates-edit-panel');

        const runWhenReady = () => {
            this.severityCollection = this.iqsTypeCollectionsService.getSeverity();
            this.init();
        };

        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, runWhenReady));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public $onChanges(changes: EventTemplateEditPanelChanges): void {
        if (changes.newItem && changes.newItem.currentValue) {
            if (!_.isEqual(this.newItem, changes.newItem.currentValue)) {
                this.newItem = changes.newItem.currentValue;
            }
        }

        if (changes.editItem && changes.editItem.currentValue) {
            if (!_.isEqual(this.editItem, changes.editItem.currentValue)) {
                this.editItem = changes.editItem.currentValue;
            }
        }

        this.init();
    }

    private init() {
        if (this.editItem) {
            this.eventTemplate = _.cloneDeep(this.editItem);
        } else {
            this.eventTemplate = _.cloneDeep(this.newItem);
            this.eventTemplate.severity = iqs.shell.Severity.Medium;
        }
    }

    public onSaveClick(): void {
        if (this.onEventTmplSave) {
            this.onEventTmplSave({ item: this.eventTemplate });
        }
    }

    public onCancelClick(): void {
        if (this.onEventTmplCancel) {
            this.onEventTmplCancel();
        }
    }
}

(() => {
    angular
        .module('iqsEventTemplateEditPanel', [])
        .component('iqsEventTemplateEditPanel', {
            bindings: EventTemplateEditPanelBindings,
            templateUrl: 'config/events_themplates/panels/EventTemplateEditPanel.html',
            controller: EventTemplateEditPanelController,
            controllerAs: '$ctrl'
        })
})();
