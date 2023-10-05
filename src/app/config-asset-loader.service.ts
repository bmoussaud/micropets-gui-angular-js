import { Injectable, isDevMode } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, shareReplay } from "rxjs/operators";
import { of } from "rxjs";

export interface Configuration {
  petServiceUrl: string;
  stage: string;
  stage_color: string;
  load_one_by_one: string;
}

@Injectable({ providedIn: "root" })
export class ConfigAssetLoaderService {
  private CONFIG_URL = "assets/app-config/config.json";
  private configuration$!: Observable<Configuration>;

  private defaultConfiguration: Configuration = {
    petServiceUrl: "https://pets-golang.micropets-dev.16x.tanzu.moussaud.org",
    stage: "localdev",
    stage_color: "blue",
    load_one_by_one: "True",
  };

  constructor(private http: HttpClient) {}

  public loadConfigurations(): any {
    if (isDevMode()) {
      console.log("Development!");
      this.configuration$ = of<Configuration>(this.defaultConfiguration);
    } else {
      if (!this.configuration$) {
        this.configuration$ = this.http
          .get<Configuration>(this.CONFIG_URL)
          .pipe(shareReplay(1));
      }
    }
    return this.configuration$;
  }
}
