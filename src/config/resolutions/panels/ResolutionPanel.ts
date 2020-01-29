class ResolutionParams {
    public item: iqs.shell.Resolution;
}

interface IResolutionPanelBindings {
    [key: string]: any;

    onResolutionEdit: any;
    onResolutionDelete: any;
    item: any;
    ngDisabled: any;
}

const ResolutionPanelBindings: IResolutionPanelBindings = {
    // change operational event
    onResolutionEdit: '&iqsEdit',
    // add operational event
    onResolutionDelete: '&iqsDelete',
    // event template for edit
    item: '<?iqsResolutionItem',
    ngDisabled: '&?'
}

class ResolutionPanelChanges implements ng.IOnChangesObject, IResolutionPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onResolutionEdit: ng.IChangesObject<() => ng.IPromise<void>>;
    onResolutionDelete: ng.IChangesObject<() => ng.IPromise<void>>;
    item: ng.IChangesObject<iqs.shell.Resolution>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class ResolutionPanelController implements ng.IController {
    public $onInit() { }
    public accessConfig: any;
    public item: iqs.shell.Resolution;
    public onResolutionEdit: () => void;
    public onResolutionDelete: () => void;
    public ngDisabled: () => boolean;

    public resolutionEventRules: iqs.shell.EventRule[];
    public severityCollection: iqs.shell.TypeNumericCollection;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        $element.addClass('iqs-resolution-panel');
        const runWhenReady = () => {
            this.accessConfig = iqsAccessConfig.getStateConfigure().access;
            this.severityCollection = this.iqsTypeCollectionsService.getSeverity();
            this.iqsEventRulesViewModel.read(() => { this.prepare(); });
        };

        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, runWhenReady));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    private prepare() {
        if (!this.item) return;
        // todo filter rule by insidents rule
        let resolutionEventRules: iqs.shell.EventRule[] = [];
        _.each(this.iqsEventRulesViewModel.getCollection(), (rule: iqs.shell.EventRule) => {
            const index = _.findIndex(this.item.rule_ids, (id: string) => {
                return rule.id === id;
            });
            if (index > -1) resolutionEventRules.push(rule);
        });

        this.resolutionEventRules = resolutionEventRules;
    }

    public $onChanges(changes: ResolutionPanelChanges): void {
        if (changes.item && changes.item.currentValue) {
            this.item = changes.item.currentValue;

            this.prepare();
        }
    }

    public onEdit(item: iqs.shell.Resolution): void {
        if (this.onResolutionEdit) {
            this.onResolutionEdit();
        }
    }

    public onDelete(item: iqs.shell.Resolution): void {
        if (this.onResolutionDelete) {
            this.onResolutionDelete();
        }
    }
}

(() => {
    angular
        .module('iqsResolutionPanel', [])
        .component('iqsResolutionPanel', {
            bindings: ResolutionPanelBindings,
            templateUrl: 'config/resolutions/panels/ResolutionPanel.html',
            controller: ResolutionPanelController,
            controllerAs: '$ctrl'
        })
})();
