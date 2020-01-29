import { IEventTemplatesSaveService } from './IEventTemplatesSaveService';

class EventTemplatesSaveService implements IEventTemplatesSaveService {
    private _eventTemplateId: string;
    private _currState: string;
    private _search: string;
    private _eventTemplate: iqs.shell.EventTemplate;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
    ) {
        "ngInject";

    }

    public set eventTemplate(eventTemplate: iqs.shell.EventTemplate) {
        this._eventTemplate = eventTemplate;
    }

    public get eventTemplate(): iqs.shell.EventTemplate {
        return this._eventTemplate;
    }

    public set eventTemplateId(eventTemplateId: string) {
        this._eventTemplateId = eventTemplateId;
    }

    public get eventTemplateId(): string {
        return this._eventTemplateId;
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
    angular.module('iqsConfigEventsTemplates.SaveService', [])
        .service('iqsEventTemplatesSaveService', EventTemplatesSaveService);

}