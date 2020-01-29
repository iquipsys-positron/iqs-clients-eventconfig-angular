import { ResolutionCheckEventRule } from '../ResolutionCheckEventRule';

class ResolutionParams {
    public item: iqs.shell.Resolution;
}

interface IResolutionEditPanelBindings {
    [key: string]: any;

    onResolutionSave: any;
    onResolutionCancel: any;
    newItem: any;
    editItem: any;
    ngDisabled: any;
}

const ResolutionEditPanelBindings: IResolutionEditPanelBindings = {
    // change operational event
    onResolutionSave: '&iqsSave',
    // add operational event
    onResolutionCancel: '&iqsCancel',
    // event template for edit
    newItem: '=?iqsNewItem',
    editItem: '=?iqsEditItem',
    ngDisabled: '&?'
}

class ResolutionEditPanelChanges implements ng.IOnChangesObject, IResolutionEditPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onResolutionSave: ng.IChangesObject<() => ng.IPromise<void>>;
    onResolutionCancel: ng.IChangesObject<() => ng.IPromise<void>>;
    newItem: ng.IChangesObject<iqs.shell.Resolution>;
    editItem: ng.IChangesObject<iqs.shell.Resolution>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class ResolutionEditPanelController implements ng.IController {
    public $onInit() { }
    public resolution: iqs.shell.Resolution;
    public resolutionEventRules: ResolutionCheckEventRule[];
    public severityCollection: iqs.shell.TypeNumericCollection;
    public selectAll: boolean;
    public checkResolution: boolean = false;

    public newItem: iqs.shell.Resolution;
    public editItem: iqs.shell.Resolution;
    public onResolutionSave: (eventTempl: ResolutionParams) => void;
    public onResolutionCancel: () => void;
    public ngDisabled: () => boolean;

    public error: string = '';
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        $element.addClass('iqs-resolution-edit-panel');

        if (this.iqsLoading.isDone) { this.init(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.init(); }));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public $onChanges(changes: ResolutionEditPanelChanges): void {
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
        this.severityCollection = this.iqsTypeCollectionsService.getSeverity();
        this.iqsEventRulesViewModel.read(() => { this.prepare(); });

        if (this.editItem) {
            this.resolution = _.cloneDeep(this.editItem);
        } else {
            this.resolution = _.cloneDeep(this.newItem);
        }

        this.checkResolution = this.resolution && this.resolution.rule_ids && this.resolution.rule_ids.length > 0;
    }

    private prepare() {
        this.selectAll = true;
        // filter rule by insidents rule
        this.resolutionEventRules = _.cloneDeep(this.iqsEventRulesViewModel.getCollection());
        this.resolutionEventRules = _.filter(this.resolutionEventRules, (r: iqs.shell.EventRule) => {
            return r.incident
        });
        _.each(this.resolutionEventRules, (rule: ResolutionCheckEventRule) => {
            const index = _.findIndex(this.resolution.rule_ids, (id: string) => {
                return rule.id === id;
            })
            rule.checked = index != -1;
            if (!rule.checked) {
                this.selectAll = false;
            }
        });
    }

    private isSelectAll(): boolean {
        let index: number = _.findIndex(this.resolutionEventRules, (rule: ResolutionCheckEventRule) => {
            return !rule.checked
        });

        return index == -1;
    }

    public onEventRuleChange() {
        this.error = '';
        this.selectAll = this.isSelectAll();
    }

    public onSelectAllChange() {
        this.error = '';
        _.each(this.resolutionEventRules, (r: ResolutionCheckEventRule) => {
            r.checked = this.selectAll;
        });
    }

    public onSaveClick(): void {
        if (this.onResolutionSave) {
            let rules: string[] = [];

            if (this.checkResolution) {
                _.each(this.resolutionEventRules, (rule: ResolutionCheckEventRule) => {
                    if (rule.checked) {
                        rules.push(rule.id);
                    }
                })
            }

            this.resolution.rule_ids = rules;
            this.onResolutionSave({ item: this.resolution });
        }
    }

    public onCancelClick(): void {
        if (this.onResolutionCancel) {
            this.onResolutionCancel();
        }
    }
}

(() => {
    angular
        .module('iqsResolutionEditPanel', [])
        .component('iqsResolutionEditPanel', {
            bindings: ResolutionEditPanelBindings,
            templateUrl: 'config/resolutions/panels/ResolutionEditPanel.html',
            controller: ResolutionEditPanelController,
            controllerAs: '$ctrl'
        })
})();
