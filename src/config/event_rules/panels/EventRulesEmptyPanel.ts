interface IEventRuleEmptyPanelBindings {
    [key: string]: any;

    onEventRuleAdd: any;
    state: any;
    isPreLoading: any;
}

const EventRuleEmptyPanelBindings: IEventRuleEmptyPanelBindings = {
    // change operational event
    onEventRuleAdd: '&iqsAdd',
    state: '<?iqsState',
    isPreLoading: '<?iqsPreLoading'
}

class EventRuleEmptyPanelChanges implements ng.IOnChangesObject, IEventRuleEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onEventRuleAdd: ng.IChangesObject<() => ng.IPromise<void>>;
    state: ng.IChangesObject<string>;
    isPreLoading: ng.IChangesObject<boolean>;
}

class EventRuleEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onEventRuleAdd: () => void;
    public state: string;
    public accessConfig: any;
    public isPreLoading: boolean;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
    ) {
        "ngInject";

        $element.addClass('iqs-event-rule-empty-panel');
        this.accessConfig = iqsAccessConfig.getStateConfigure().access;
    }

    public onAdd(): void {
        if (this.onEventRuleAdd) {
            this.onEventRuleAdd();
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
        .module('iqsEventRuleEmptyPanel', [])
        .component('iqsEventRuleEmptyPanel', {
            bindings: EventRuleEmptyPanelBindings,
            templateUrl: 'config/event_rules/panels/EventRulesEmptyPanel.html',
            controller: EventRuleEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
