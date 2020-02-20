import { IEventTemplatesSaveService } from './IEventTemplatesSaveService';

export const ConfigEventsThemplatesStateName: string = 'app.events_themplates';

class ConfigEventsTemplatesController implements ng.IController {
    public $onInit() { }
    private mediaSizeGtSm: boolean;
    public severityCollection: iqs.shell.TypeNumericCollection;
    public details: boolean;
    public searchCriteria: string = '';
    public searchQuery: string = '';
    public currentState: string;
    public new: iqs.shell.EventTemplate;
    public edit: iqs.shell.EventTemplate;
    public accessConfig: any;
    public isPreLoading: boolean = true;
    private cf: Function[] = [];

    constructor(
        private $window: ng.IWindowService,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        $scope: ng.IScope,
        $rootScope: ng.IRootScopeService,
        private pipNavService: pip.nav.INavService,
        public pipMedia: pip.layouts.IMediaService,
        private pipScroll: pip.services.IScrollService,
        private pipConfirmationDialog: pip.dialogs.IConfirmationDialogService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        private iqsOperationalEventTemplatesViewModel: iqs.shell.IOperationalEventTemplatesViewModel,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        private iqsEventTemplatesSaveService: IEventTemplatesSaveService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
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
            this.severityCollection = this.iqsTypeCollectionsService.getSeverity();
            this.iqsOperationalEventTemplatesViewModel.filter = null;
            this.iqsOperationalEventTemplatesViewModel.isSort = true;
            this.iqsOperationalEventTemplatesViewModel.reload(() => {
                let collection = this.iqsOperationalEventTemplatesViewModel.getCollection(this.searchCriteria);
                this.isPreLoading = false;
            });
        };

        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, runWhenReady.bind(this)));

        this.appHeader();
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, () => {
            this.appHeader();
        }));
    }

    public $onDestroy() {
        this.saveCurrentState();
        for (const f of this.cf) { f(); }
    }

    private saveCurrentState() {
        this.iqsEventTemplatesSaveService.eventTemplateId = this.collection && this.collection.length > 0 && this.selectedIndex > -1 ? this.collection[this.selectedIndex].id : null;
        this.iqsEventTemplatesSaveService.currState = this.currentState;
        this.iqsEventTemplatesSaveService.search = this.searchCriteria;
        this.iqsEventTemplatesSaveService.eventTemplate = this.new ? this.new : this.edit;
    }

    private restoreState() {
        this.searchQuery = this.iqsEventTemplatesSaveService.search ? this.iqsEventTemplatesSaveService.search : this.$location.search()['search'] || '';
        this.searchCriteria = this.searchQuery;
        if (!this.$location.search()['event_template_id'] && this.iqsEventTemplatesSaveService.eventTemplateId) {
            this.$location.search('event_template_id', this.iqsEventTemplatesSaveService.eventTemplateId);
        }
        this.currentState = this.iqsEventTemplatesSaveService.currState ? this.iqsEventTemplatesSaveService.currState : null;
        this.currentState = this.currentState == iqs.shell.States.Add || this.currentState == iqs.shell.States.Edit ? null : this.currentState;
        if (this.currentState === iqs.shell.States.Add) {
            this.new = this.iqsEventTemplatesSaveService.eventTemplate;
            this.edit = null;
        } else if (this.currentState === iqs.shell.States.Edit) {
            this.new = null;
            if (this.iqsEventTemplatesSaveService.eventTemplate) {
                this.edit = this.iqsEventTemplatesSaveService.eventTemplate;
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
                ? 'EVENTS_TEMPLATES_DETAILS_NEW'
                : this.currentState === iqs.shell.States.Edit
                    ? 'EVENTS_TEMPLATES_DETAILS_EDIT'
                    : 'EVENTS_TEMPLATES_DETAILS';

            this.pipNavService.breadcrumb.items = [
                <pip.nav.BreadcrumbItem>{
                    title: "EVENTS_TEMPLATES", click: () => {
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
            this.pipNavService.breadcrumb.text = 'EVENTS_TEMPLATES';
            this.pipNavService.icon.showMenu();
        }

        this.pipNavService.actions.hide();
    }

    private focusedNewButton() {
        this.pipScroll.scrollTo('.pip-list-container', '#new-item', 300);
    }

    public selectItem(index: number) {
        if (this.state != iqs.shell.States.Data) { return };

        if (index !== undefined && index !== null) this.iqsOperationalEventTemplatesViewModel.selectItem(index);
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }

    public get selectedIndex() {
        return this.state != iqs.shell.States.Add ? this.iqsOperationalEventTemplatesViewModel.selectedIndex : -1;
    }

    public set selectedIndex(value: number) {

    }

    public get collection(): iqs.shell.EventTemplate[] {
        return this.iqsOperationalEventTemplatesViewModel.getCollection(this.searchCriteria);
    }

    public get state(): string {
        return this.currentState ? this.currentState : this.iqsOperationalEventTemplatesViewModel.state;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsOperationalEventTemplatesViewModel.getTransaction();
    }

    public get searchedCollection(): string[] {
        return this.iqsOperationalEventTemplatesViewModel.searchedCollection;
    }

    public reload(): void {
        this.iqsOperationalEventTemplatesViewModel.reload();
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
                    title: this.pipTranslate.translate('EVENT_TEMPLATES_DELETE_CONFIRMATION_TITLE') + ' "' + this.collection[this.selectedIndex].description + '"?',
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
            this.iqsOperationalEventTemplatesViewModel.getCollection(this.searchCriteria);
        }
    }

    public onCanselSearch() {
        this.searchCriteria = '';
        this.searchQuery = '';
        this.$location.search('search', this.searchCriteria);
        if (this.state == iqs.shell.States.Empty) {
            this.iqsOperationalEventTemplatesViewModel.getCollection(this.searchCriteria);
        }
    }

    public onAdd() {
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }

        this.new = new iqs.shell.EventTemplate();
        this.edit = null;
        this.currentState = iqs.shell.States.Add;
        if (this.pipMedia('gt-sm')) {
            this.focusedNewButton();
        }
    }

    public onSave(item: iqs.shell.EventTemplate): void {
        if (this.transaction.busy() || !item) {
            return;
        }

        if (this.currentState == iqs.shell.States.Add) {
            item.org_id = this.iqsOrganization.orgId;

            this.iqsOperationalEventTemplatesViewModel.create(
                item,
                (data: iqs.shell.EventTemplate) => {
                    this.currentState = null
                    this.new = null;
                    this.searchCriteria = '';
                    if (this.state == iqs.shell.States.Empty) {
                        this.iqsOperationalEventTemplatesViewModel.getCollection(this.searchCriteria);
                    }
                },
                (error: any) => { }
            );
        } else if (this.currentState == iqs.shell.States.Edit) {
            this.iqsOperationalEventTemplatesViewModel.updateEventTemplateById(
                item.id,
                item,
                (data: iqs.shell.EventTemplate) => {
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

    public onDeleteItem(item: iqs.shell.EventTemplate) {
        if (this.transaction.busy()) {
            return;
        }

        if (item && item.id) {
            this.iqsOperationalEventTemplatesViewModel.deleteEventTemplateById(
                item.id,
                () => {
                    this.details = false;
                    this.$location.search('details', 'main');
                    this.appHeader();
                },
                (error: any) => { }
            );
        }
    }
}

function configureConfigEventsTemplatesRoute(
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(ConfigEventsThemplatesStateName, {
            url: '/events_templates?event_template_id&search&details',
            controller: ConfigEventsTemplatesController,
            reloadOnSearch: false,
            auth: true,
            controllerAs: '$ctrl',
            templateUrl: 'config/events_themplates/EventsTemplates.html'
        });
}

function configureConfigEventsTemplatesAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.manager;
    let accessConfig: any = {
        addTemplate: iqs.shell.AccessRole.manager,
        editTemplate: iqs.shell.AccessRole.manager,
        deleteTemplate: iqs.shell.AccessRole.manager
    }
    iqsAccessConfigProvider.registerStateAccess(ConfigEventsThemplatesStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(ConfigEventsThemplatesStateName, accessConfig);
}

angular
    .module('iqsConfigEventsTemplates', [
        'pipNav', 'iqsEventTemplates.ViewModel',

        'iqsAccessConfig',
        'iqsEventTemplatePanel',
        'iqsEventTemplateEmptyPanel',
        'iqsEventTemplateEditPanel',
        'iqsConfigEventsTemplates.SaveService',

        'iqsGlobalSearch'
    ])
    .config(configureConfigEventsTemplatesRoute)
    .config(configureConfigEventsTemplatesAccess);