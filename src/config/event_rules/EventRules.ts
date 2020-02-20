import { IEventRuleSaveService } from './IEventRuleSaveService';

export const ConfigEventRulesStateName: string = 'app.rules';

class ConfigEventRulesController implements ng.IController {
    public $onInit() { }
    private cf: Function[] = [];
    private mediaSizeGtSm: boolean;
    public accessConfig: any;
    public details: boolean;
    public severityCollection: iqs.shell.TypeNumericCollection;
    public ruleTypeMeasure: iqs.shell.TypeCollection;
    public searchCriteria: string = '';
    public searchQuery: string = '';
    public currentState: string;
    public new: iqs.shell.EventRule;
    public edit: iqs.shell.EventRule;
    public isPreLoading: boolean = true;

    constructor(
        private $window: ng.IWindowService,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        $scope: ng.IScope,
        $rootScope: ng.IRootScopeService,
        private pipNavService: pip.nav.INavService,
        private pipMedia: pip.layouts.IMediaService,
        private pipScroll: pip.services.IScrollService,
        private pipTranslate: pip.services.ITranslateService,
        private pipConfirmationDialog: pip.dialogs.IConfirmationDialogService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        private iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        private iqsEventRuleSaveService: IEventRuleSaveService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsAccountsViewModel: iqs.shell.IAccountsViewModel,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        this.restoreState();
        this.mediaSizeGtSm = this.pipMedia('gt-sm');

        if (!this.pipMedia('gt-sm')) {
            if (this.currentState === iqs.shell.States.Add || this.currentState === iqs.shell.States.Edit) {
                this.details = true;
            } else {
                this.details = $location.search().details == 'details' ? true : false;
            }
        } else {
            this.details = false;
            this.$location.search('details', 'main');
        }

        this.cf.push($rootScope.$on('pipMainResized', () => {
            if (this.mediaSizeGtSm !== this.pipMedia('gt-sm')) {
                this.mediaSizeGtSm = this.pipMedia('gt-sm');

                if (this.pipMedia('gt-sm')) {
                    this.details = false;
                } else {
                    if (this.currentState === iqs.shell.States.Add || this.currentState === iqs.shell.States.Edit) {
                        this.details = true;
                    }
                }
                this.appHeader();
            }
        }));

        const runWhenReady = () => {
            this.accessConfig = iqsAccessConfig.getStateConfigure().access;
            this.iqsAccountsViewModel.initAccounts('all');
            this.severityCollection = this.iqsTypeCollectionsService.getSeverity();
            this.ruleTypeMeasure = this.iqsTypeCollectionsService.getEventRuleTypeMeasure();
            this.iqsEventRulesViewModel.filter = null;
            this.iqsEventRulesViewModel.isSort = true;

            this.iqsEventRulesViewModel.reload(() => {
                this.iqsEventRulesViewModel.getCollection(this.searchCriteria);
            });
            this.isPreLoading = false;
        };

        this.appHeader();
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, () => {
            this.appHeader();
        }));

        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, runWhenReady.bind(this)));
    }

    public $onDestroy() {
        this.saveCurrentState();
        for (const f of this.cf) { f(); }
    }

    private saveCurrentState() {
        this.iqsEventRuleSaveService.ruleId = this.collection && this.collection.length > 0 && this.selectedIndex > -1 ? this.collection[this.selectedIndex].id : null;
        this.iqsEventRuleSaveService.currState = this.currentState;
        this.iqsEventRuleSaveService.search = this.searchQuery;
        this.iqsEventRuleSaveService.rule = this.new ? this.new : this.edit;
    }

    private restoreState() {
        this.searchQuery = this.iqsEventRuleSaveService.search ? this.iqsEventRuleSaveService.search : this.$location.search()['search'] || '';
        this.searchCriteria = this.searchQuery;
        if (!this.$location.search()['rule_id'] && this.iqsEventRuleSaveService.ruleId) {
            this.$location.search('rule_id', this.iqsEventRuleSaveService.ruleId);
        }
        this.currentState = this.iqsEventRuleSaveService.currState ? this.iqsEventRuleSaveService.currState : null;
        this.currentState = this.currentState == iqs.shell.States.Add || this.currentState == iqs.shell.States.Edit ? null : this.currentState;
        if (this.currentState === iqs.shell.States.Add) {
            this.new = this.iqsEventRuleSaveService.rule;
            this.edit = null;
        } else if (this.currentState === iqs.shell.States.Edit) {
            this.new = null;
            if (this.iqsEventRuleSaveService.rule) {
                this.edit = this.iqsEventRuleSaveService.rule;
            } else {
                this.edit = null;
                this.currentState = null;
            }
        }
    }

    private toMainFromDetails(): void {
        this.$location.search('details', 'main');
        this.details = false;
        this.onCancel();
        this.appHeader();
    }

    private appHeader(): void {
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'sites': this.pipMedia('gt-sm') };
        this.pipNavService.breadcrumb.breakpoint = 'gt-sm';

        if (!this.pipMedia('gt-sm') && this.details) {
            const detailsTitle = this.currentState === iqs.shell.States.Add
                ? 'EVENT_RULE_DETAILS_NEW'
                : this.currentState === iqs.shell.States.Edit
                    ? 'EVENT_RULE_DETAILS_EDIT'
                    : 'EVENT_RULE_DETAILS';

            this.pipNavService.breadcrumb.items = [
                <pip.nav.BreadcrumbItem>{
                    title: "RULES", click: () => {
                        this.toMainFromDetails();
                    }, subActions: []
                },
                <pip.nav.BreadcrumbItem>{
                    title: detailsTitle, click: () => { }, subActions: []
                }
            ];
            this.pipNavService.icon.showBack(() => {
                this.toMainFromDetails();
            });
        } else {
            this.pipNavService.breadcrumb.text = 'RULES';
            this.pipNavService.icon.showMenu();
        }

        this.pipNavService.actions.hide();
    }

    private focusedNewButton() {
        this.pipScroll.scrollTo('.pip-list-container', '#new-item', 300);
    }

    public selectItem(index: number) {
        if (this.state == iqs.shell.States.Add || this.state == iqs.shell.States.Edit) { return };

        if (index !== undefined && index !== null) this.iqsEventRulesViewModel.selectItem(index);
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }

    public get selectedIndex() {
        return this.state != iqs.shell.States.Add ? this.iqsEventRulesViewModel.selectedIndex : -1;
    }

    public set selectedIndex(value: number) {

    }

    public get collection(): iqs.shell.EventRule[] {
        // return [];
        return this.iqsEventRulesViewModel.getCollection(this.searchCriteria);
    }

    public get state(): string {
        // return 'empty'
        return this.currentState ? this.currentState : this.iqsEventRulesViewModel.state;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsEventRulesViewModel.getTransaction();
    }

    public get searchedCollection(): string[] {
        return this.iqsEventRulesViewModel.searchedCollection;
    }

    public reload(): void {
        this.iqsEventRulesViewModel.reload();
    }

    public onRetry() {
        this.$window.history.back();
    }

    public onEdit() {
        if (this.selectedIndex > -1 && this.collection[this.selectedIndex]) {
            this.edit = _.cloneDeep(this.collection[this.selectedIndex]);
            this.new = null;
            this.currentState = iqs.shell.States.Edit;
        }
    }

    public onDelete() {
        if (this.transaction.busy()) {
            return;
        }

        if (this.selectedIndex > -1 && this.collection[this.selectedIndex]) {
            this.pipConfirmationDialog.show(
                {
                    event: null,
                    title: this.pipTranslate.translate('EVENT_RULE_DELETE_CONFIRMATION_TITLE') + ' "' + this.collection[this.selectedIndex].name + '"?',
                    ok: 'CONFIRM_DELETE',
                    cancel: 'CONFIRM_CANCEL'
                },
                () => {
                    this.onDeleteItem(this.collection[this.selectedIndex]);
                },
                () => {
                    console.log('You disagreed');
                }
            );
        }
    }

    public onSearchResult(searchQuery: string): void {
        this.searchCriteria = searchQuery;
        this.$location.search('search', this.searchCriteria);

        if (this.state == iqs.shell.States.Empty) {
            this.iqsEventRulesViewModel.getCollection(this.searchCriteria);
        }
    }

    public onCanselSearch() {
        this.searchCriteria = '';
        this.searchQuery = '';
        this.$location.search('search', this.searchCriteria);
        if (this.state == iqs.shell.States.Empty) {
            this.iqsEventRulesViewModel.getCollection(this.searchCriteria);
        }
    }

    public onAdd() {
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }

        this.new = new iqs.shell.EventRule();
        this.edit = null;
        this.currentState = iqs.shell.States.Add;

        if (this.pipMedia('gt-sm')) {
            this.focusedNewButton();
        }
    }

    public onSave(item: iqs.shell.EventRule): void {
        if (this.transaction.busy() || !item) {
            return;
        }

        if (this.currentState == iqs.shell.States.Add) {
            item.org_id = this.iqsOrganization.orgId;
            if (item.all_zones) {
                item.include_zone_ids = [];
            }
            if (item.all_objects) {
                item.include_group_ids = [];
                item.include_object_ids = [];
            }
            this.iqsEventRulesViewModel.create(
                item,
                (data: iqs.shell.EventRule) => {
                    this.currentState = null
                    this.new = null;
                    this.searchCriteria = '';
                    if (this.state == iqs.shell.States.Empty) {
                        this.iqsEventRulesViewModel.getCollection(this.searchCriteria);
                    }
                },
                (error: any) => { }
            );
        } else {
            // update rule
            this.iqsEventRulesViewModel.updateEventRuleById(
                item.id,
                item,
                (data: iqs.shell.EventRule) => {
                    this.currentState = null
                    this.edit = null;
                },
                (error: any) => { }
            );
        }
    }

    public onCancel() {
        this.details = this.currentState == iqs.shell.States.Add ? false : this.details;
        this.currentState = null;
        this.new = null;
        this.edit = null;
        this.appHeader();
    }

    public onDeleteItem(item: iqs.shell.EventRule) {
        if (this.transaction.busy()) {
            return;
        }

        if (item && item.id) {
            this.iqsEventRulesViewModel.deleteEventRuleById(
                item.id,
                () => {
                    this.details = false;
                    this.$location.search('details', 'main');
                    this.appHeader();
                    // todo toast deleted
                },
                (error: any) => { }
            );
        }
    }

}

function configureConfigEventRulesRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(ConfigEventRulesStateName, {
            url: '/event_rules?rule_id&search&section$details',
            controller: ConfigEventRulesController,
            auth: true,
            reloadOnSearch: false,
            controllerAs: '$ctrl',
            templateUrl: 'config/event_rules/EventRules.html'
        });
}

function configureConfigEventRulesAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.manager;
    let accessConfig: any = {
        addEventRule: iqs.shell.AccessRole.manager,
        editEventRule: iqs.shell.AccessRole.manager,
        deleteEventRule: iqs.shell.AccessRole.manager
    }

    iqsAccessConfigProvider.registerStateAccess(ConfigEventRulesStateName, accessLevel);

    iqsAccessConfigProvider.registerStateConfigure(ConfigEventRulesStateName, accessConfig);
}

(() => {

    angular
        .module('iqsConfigEventRules', [
            'pipNav', 'iqsEventRules.ViewModel', 'iqsGlobalSearch',

            'iqsMultiSelectDialog',

            'iqsAccessConfig',
            'iqsEventRuleEmptyPanel',
            'iqsDetailsEventRulePanel',
            // 'iqsActionEditEventRulePanel',
            // 'iqsConditionEditEventRulePanel',
            'iqsInformationEditEventRulePanel',

            'iqsConfigEventRules.SaveService'])
        .config(configureConfigEventRulesRoute)
        .config(configureConfigEventRulesAccess);
})();
