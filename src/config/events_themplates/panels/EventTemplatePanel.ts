interface IEventTemplatePanelBindings {
    [key: string]: any;

    onEventTmplEdit: any;
    onEventTmplDelete: any;
    item: any;
    ngDisabled: any;
}

const EventTemplatePanelBindings: IEventTemplatePanelBindings = {
    // change operational event
    onEventTmplEdit: '&iqsEdit',
    // add operational event
    onEventTmplDelete: '&iqsDelete',
    // event template for edit
    item: '<?iqsEventTemplateItem',
    ngDisabled: '&?'
}

class EventTemplatePanelChanges implements ng.IOnChangesObject, IEventTemplatePanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onEventTmplEdit: ng.IChangesObject<() => ng.IPromise<void>>;
    onEventTmplDelete: ng.IChangesObject<() => ng.IPromise<void>>;
    item: ng.IChangesObject<iqs.shell.EventTemplate>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class EventTemplatePanelController implements ng.IController {
    public $onInit() { }
    public item: iqs.shell.EventTemplate;
    public onEventTmplEdit: () => void;
    public onEventTmplDelete: () => void;
    public ngDisabled: () => boolean;
    public accessConfig: any;
    public severityCollection: iqs.shell.TypeNumericCollection;
    private cf: Function[] = [];

    constructor(
        private $element: JQuery,
        $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        $element.addClass('iqs-event-templates-panel');
        const runWhenReady = () => {
            this.accessConfig = iqsAccessConfig.getStateConfigure().access;
            this.severityCollection = this.iqsTypeCollectionsService.getSeverity();
        };

        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, runWhenReady));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public $onChanges(changes: EventTemplatePanelChanges): void {
        if (changes.item && changes.item.currentValue) {
            if (!_.isEqual(this.item, changes.item.currentValue)) {
                this.item = changes.item.currentValue;
            }
        }
    }

    public onEdit(item: iqs.shell.EventTemplate): void {
        if (this.onEventTmplEdit) {
            this.onEventTmplEdit();
        }
    }

    public onDelete(item: iqs.shell.EventTemplate): void {
        if (this.onEventTmplDelete) {
            this.onEventTmplDelete();
        }
    }
}

(() => {
    angular
        .module('iqsEventTemplatePanel', [])
        .component('iqsEventTemplatePanel', {
            bindings: EventTemplatePanelBindings,
            templateUrl: 'config/events_themplates/panels/EventTemplatePanel.html',
            controller: EventTemplatePanelController,
            controllerAs: '$ctrl'
        })
})();
