import { IResolutionSaveService } from './IResolutionSaveService';

export const ConfigResolutionsStateName: string = 'app.resolutions';

class ConfigResolutionsController implements ng.IController {
    public $onInit() { }
    private cf: Function[] = [];
    private mediaSizeGtSm: boolean;

    public details: boolean;
    public accessConfig: any;
    public searchCriteria: string = '';
    public currentState: string;
    public new: iqs.shell.Resolution;
    public edit: iqs.shell.Resolution;
    public isPreLoading: boolean = true;

    constructor(
        private $window: ng.IWindowService,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        $scope: ng.IScope,
        private pipNavService: pip.nav.INavService,
        private pipTranslate: pip.services.ITranslateService,
        private pipMedia: pip.layouts.IMediaService,
        private pipScroll: pip.services.IScrollService,
        private pipConfirmationDialog: pip.dialogs.IConfirmationDialogService,
        $rootScope: ng.IRootScopeService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        private iqsResolutionsViewModel: iqs.shell.IResolutionsViewModel,
        private iqsResolutionSaveService: IResolutionSaveService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        this.restoreState();

        const runWhenReady = () => {
            this.accessConfig = iqsAccessConfig.getStateConfigure().access;
            this.mediaSizeGtSm = this.pipMedia('gt-sm');
            this.iqsResolutionsViewModel.filter = null;
            this.iqsResolutionsViewModel.isSort = true;
            this.iqsResolutionsViewModel.reload(() => {
                let collection = this.iqsResolutionsViewModel.getCollection(this.searchCriteria);
                this.isPreLoading = false;
            });
        };

        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, runWhenReady.bind(this)));

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

        this.appHeader();
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, () => { this.appHeader(); }));
    }

    public $onDestroy() {
        this.saveCurrentState();
        for (const f of this.cf) { f(); }
    }

    private saveCurrentState() {
        this.iqsResolutionSaveService.resolutionId = this.collection && this.collection.length > 0 && this.selectedIndex > -1 ? this.collection[this.selectedIndex].id : null;
        this.iqsResolutionSaveService.currState = this.currentState;
        this.iqsResolutionSaveService.search = this.searchCriteria;
        this.iqsResolutionSaveService.resolution = this.new ? this.new : this.edit;
    }

    private restoreState() {
        this.searchCriteria = this.iqsResolutionSaveService.search ? this.iqsResolutionSaveService.search : this.$location.search()['search'] || '';
        if (!this.$location.search()['resolution_id'] && this.iqsResolutionSaveService.resolutionId) {
            this.$location.search('resolution_id', this.iqsResolutionSaveService.resolutionId);
        }
        this.currentState = this.iqsResolutionSaveService.currState ? this.iqsResolutionSaveService.currState : null;
        this.currentState = this.currentState == iqs.shell.States.Add || this.currentState == iqs.shell.States.Edit ? null : this.currentState;
        if (this.currentState === iqs.shell.States.Add) {
            this.new = this.iqsResolutionSaveService.resolution;
            this.edit = null;
        } else if (this.currentState === iqs.shell.States.Edit) {
            this.new = null;
            if (this.iqsResolutionSaveService.resolution) {
                this.edit = this.iqsResolutionSaveService.resolution;
            } else {
                this.edit = null;
                this.currentState = null;
            }

            this.new = null;
            this.edit = this.iqsResolutionSaveService.resolution;
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
                ? 'RESOLUTION_DETAILS_NEW'
                : this.currentState === iqs.shell.States.Edit
                    ? 'RESOLUTION_DETAILS_EDIT'
                    : 'RESOLUTION_DETAILS';

            this.pipNavService.breadcrumb.items = [
                <pip.nav.BreadcrumbItem>{
                    title: "RESOLUTIONS", click: () => {
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
            this.pipNavService.breadcrumb.text = 'RESOLUTIONS';
            this.pipNavService.icon.showMenu();
        }

        this.pipNavService.actions.hide();
    }

    private focusedNewButton() {
        this.pipScroll.scrollTo('.pip-list-container', '#new-item', 300);
    }

    public selectItem(index: number) {
        if (this.state == iqs.shell.States.Add || this.state == iqs.shell.States.Edit) { return };

        if (index !== undefined && index !== null) this.iqsResolutionsViewModel.selectItem(index);
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }

    public get selectedIndex() {
        return this.state != iqs.shell.States.Add ? this.iqsResolutionsViewModel.selectedIndex : -1;
    }

    public set selectedIndex(value: number) {

    }

    public get collection(): iqs.shell.Resolution[] {
        // return [];
        return this.iqsResolutionsViewModel.getCollection(this.searchCriteria);
    }

    public get state(): string {
        // return 'empty'
        return this.currentState ? this.currentState : this.iqsResolutionsViewModel.state;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsResolutionsViewModel.getTransaction();
    }

    public get searchedCollection(): string[] {
        return this.iqsResolutionsViewModel.searchedCollection;
    }

    public reload(): void {
        this.iqsResolutionsViewModel.reload();
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
                    title: this.pipTranslate.translate('RESOLUTION_DELETE_CONFIRMATION_TITLE') + ' "' + this.collection[this.selectedIndex].resolution + '"?',
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
            this.iqsResolutionsViewModel.getCollection(this.searchCriteria);
        }
    }

    public onCanselSearch() {
        this.searchCriteria = '';
        this.$location.search('search', this.searchCriteria);
    }

    public onAdd() {
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }

        this.new = new iqs.shell.Resolution();
        this.edit = null;
        this.currentState = iqs.shell.States.Add;

        if (this.pipMedia('gt-sm')) {
            this.focusedNewButton();
        }
    }

    public onSave(item: iqs.shell.Resolution): void {
        if (this.transaction.busy() || !item) {
            return;
        }

        if (this.currentState == iqs.shell.States.Add) {
            item.org_id = this.iqsOrganization.orgId;
            this.iqsResolutionsViewModel.create(
                item,
                (data: iqs.shell.Resolution) => {
                    this.currentState = null
                    this.new = null;
                    this.searchCriteria = '';
                    if (this.state == iqs.shell.States.Empty) {
                        this.iqsResolutionsViewModel.getCollection(this.searchCriteria);
                    }
                },
                (error: any) => { }
            );
        } else if (this.currentState == iqs.shell.States.Edit) {
            this.iqsResolutionsViewModel.updateResolutionById(
                item.id,
                item,
                (data: iqs.shell.Resolution) => {
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

    public onDeleteItem(item: iqs.shell.Resolution) {
        if (this.transaction.busy()) {
            return;
        }

        if (item && item.id) {
            this.iqsResolutionsViewModel.deleteResolutionById(
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

function configureConfigResolutionsRoute(
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(ConfigResolutionsStateName, {
            url: '/resolutions?resolution_id&details&search',
            controller: ConfigResolutionsController,
            reloadOnSearch: false,
            auth: true,
            controllerAs: '$ctrl',
            templateUrl: 'config/resolutions/Resolution.html'
        });
}

function configureConfigResolutionsAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.manager;
    let accessConfig: any = {
        addResolution: iqs.shell.AccessRole.manager,
        editResolution: iqs.shell.AccessRole.manager,
        deleteResolution: iqs.shell.AccessRole.manager
    }
    iqsAccessConfigProvider.registerStateAccess(ConfigResolutionsStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(ConfigResolutionsStateName, accessConfig);
}

(() => {

    angular
        .module('iqsConfigResolutions', [
            'pipNav', 'iqsResolutions.ViewModel',

            'iqsResolutionPanel',
            'iqsResolutionEmptyPanel',
            'iqsResolutionEditPanel',
            'iqsConfigResolution.SaveService',

            'iqsGlobalSearch'
        ])
        .config(configureConfigResolutionsRoute)
        .config(configureConfigResolutionsAccess);
})();
