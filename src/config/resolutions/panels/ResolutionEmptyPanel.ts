interface IResolutionEmptyPanelBindings {
    [key: string]: any;

    onResolutionAdd: any;
    state: any;
    isPreLoading: any;
}

const ResolutionEmptyPanelBindings: IResolutionEmptyPanelBindings = {
    // change operational event
    onResolutionAdd: '&iqsAdd',
    state: '<?iqsState',
    isPreLoading: '<?iqsPreLoading'
}

class ResolutionEmptyPanelChanges implements ng.IOnChangesObject, IResolutionEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onResolutionAdd: ng.IChangesObject<() => ng.IPromise<void>>;
    state: ng.IChangesObject<string>;
    isPreLoading: ng.IChangesObject<boolean>;
}

class ResolutionEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onResolutionAdd: () => void;
    public accessConfig: any;
    public isPreLoading: boolean;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService
    ) {
        "ngInject";

        $element.addClass('iqs-resolution-empty-panel');
        this.accessConfig = iqsAccessConfig.getStateConfigure().access;

    }

    public $onChanges(changes: EventRuleEmptyPanelChanges) {
        if (changes.isPreLoading && changes.isPreLoading.currentValue === false) {
            this.accessConfig = this.iqsAccessConfig.getStateConfigure().access;
        }
    }

    public onAdd(): void {
        if (this.onResolutionAdd) {
            this.onResolutionAdd();
        }
    }
}

(() => {
    angular
        .module('iqsResolutionEmptyPanel', [])
        .component('iqsResolutionEmptyPanel', {
            bindings: ResolutionEmptyPanelBindings,
            templateUrl: 'config/resolutions/panels/ResolutionEmptyPanel.html',
            controller: ResolutionEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
