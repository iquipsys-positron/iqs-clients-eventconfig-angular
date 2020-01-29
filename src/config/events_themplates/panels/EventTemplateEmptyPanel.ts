interface IEventTemplateEmptyPanelBindings {
    [key: string]: any;

    onEventTmplAdd: any;
    state: any;
    isPreLoading: any;
}

const EventTemplateEmptyPanelBindings: IEventTemplateEmptyPanelBindings = {
    // change operational event
    onEventTmplAdd: '&iqsAdd',
    state: '<?iqsState',
    isPreLoading: '<?iqsPreLoading',
}

class EventTemplateEmptyPanelChanges implements ng.IOnChangesObject, IEventTemplateEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onEventTmplAdd: ng.IChangesObject<() => ng.IPromise<void>>;
    state: ng.IChangesObject<string>;
    isPreLoading: ng.IChangesObject<boolean>;
}

class EventTemplateEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onEventTmplAdd: () => void;
    public accessConfig: any;
    public isPreLoading: boolean;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService
    ) {
        "ngInject";

        $element.addClass('iqs-event-templates-empty-panel');
        this.accessConfig = iqsAccessConfig.getStateConfigure().access;
    }

    public onAdd(): void {
        if (this.onEventTmplAdd) {
            this.onEventTmplAdd();
        }
    }

    public $onChanges(changes: EventRuleEmptyPanelChanges) {
        if (changes.isPreLoading && changes.isPreLoading.currentValue === false) {
            this.accessConfig = this.iqsAccessConfig.getStateConfigure().access;
        }
    }
}

(() => {
    angular
        .module('iqsEventTemplateEmptyPanel', [])
        .component('iqsEventTemplateEmptyPanel', {
            bindings: EventTemplateEmptyPanelBindings,
            templateUrl: 'config/events_themplates/panels/EventTemplateEmptyPanel.html',
            controller: EventTemplateEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
