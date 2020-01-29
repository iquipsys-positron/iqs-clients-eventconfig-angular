import { IResolutionSaveService } from './IResolutionSaveService';

class ResolutionSaveService implements IResolutionSaveService {
    private _resolutionId: string;
    private _currState: string;
    private _search: string;
    private _resolution: iqs.shell.Resolution;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
    ) {
        "ngInject";

    }

    public set resolution(resolution: iqs.shell.Resolution) {
        this._resolution = resolution;
    }

    public get resolution(): iqs.shell.Resolution {
        return this._resolution;
    }

    public set resolutionId(resolutionId: string) {
        this._resolutionId = resolutionId;
    }

    public get resolutionId(): string {
        return this._resolutionId;
    }

    public set currState(currState: string) {
        this._currState = currState;
    }

    public get currState(): string {
        return this._currState;
    }

    public set search(search: string) {
        this._search = search;
    }

    public get search(): string {
        return this._search;
    }

}

{
    angular.module('iqsConfigResolution.SaveService', [])
        .service('iqsResolutionSaveService', ResolutionSaveService);

}