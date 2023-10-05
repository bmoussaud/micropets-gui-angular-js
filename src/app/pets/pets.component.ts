import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { concatMap, map, mergeMap } from "rxjs/operators";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import {
  ConfigAssetLoaderService,
  Configuration,
} from "../config-asset-loader.service";
import {
  PetsService,
  PetsData,
  PetsEntity,
  HostnamesEntity,
  PetsConfig,
} from "../pets.service";
import { from } from "rxjs";
import { validateHorizontalPosition } from "@angular/cdk/overlay";

@Component({
  selector: "app-pets",
  templateUrl: "./pets.component.html",
  styleUrls: ["./pets.component.css"],
})
export class PetsComponent implements OnInit {
  public pets: PetsEntity[] = [];
  public hostnames: HostnamesEntity[] = [];
  public env: string = "";
  public hostnamesstr: string = "";
  public env_color: string = "pink";
  public dataSource!: MatTableDataSource<any>;
  public dataSourceConfiguration!: MatTableDataSource<PetsConfig>;
  public configuration: PetsConfig[] = [];
  public config!: Configuration;

  displayedColumns = ["name", "kind", "age", "pic", "from"];
  displayedConfigColumns = ["kind", "hostname", "driver", "url"];

  constructor(
    private location: Location,
    private configService: ConfigAssetLoaderService,
    private petsService: PetsService
  ) {
    this.configService.loadConfigurations().subscribe(
      (data: Configuration) =>
        (this.config = {
          petServiceUrl: data.petServiceUrl,
          stage: data.stage,
          stage_color: data.stage_color,
          load_one_by_one: data.load_one_by_one,
        })
    );
  }

  ngOnInit() {
    this.location.subscribe(() => {
      this.refresh();
    });
    this.refresh();
  }

  private refresh() {
    if (this.config.load_one_by_one == "True") {
      this.refresh_one_by_one();
    } else {
      this.refresh_all();
    }
  }

  private refresh_all() {
    console.log("------------------- refresh");
    console.log(this.config.petServiceUrl);
    this.petsService
      .getPetsData(this.config.petServiceUrl)
      .pipe(map((result) => result))
      .subscribe((result) => {
        this.pets = result["Pets"];
        this.hostnames = result["Hostnames"];
        var h: string[] = new Array(4);
        for (let index = 0; index < this.hostnames.length; index++) {
          const element = this.hostnames[index];
          h[index] = element.Hostname;
        }
        this.hostnamesstr = h.join(", ");

        this.env = this.config.stage;
        this.env_color = this.config.stage_color;
        this.dataSource = new MatTableDataSource(this.pets);
      });
  }

  private get_host_name_by_service(service: string): string {
    console.log("get_host_name_by_service " + service);
    for (let index = 0; index < this.hostnames.length; index++) {
      if (this.hostnames[index].Service == service) {
        return this.hostnames[index].Hostname;
      }
    }
    return "Host of " + service;
  }

  private refresh_one_by_one() {
    this.petsService
      .getPetsData(this.config.petServiceUrl)
      .pipe(map((result) => result))
      .subscribe((result) => {
        var urls: string[] = new Array(result["Pets"].length);
        for (let index = 0; index < result["Pets"].length; index++) {
          if (this.config.petServiceUrl == "/") {
            urls[index] = result["Pets"][index].URI;
          } else {
            urls[index] = this.config.petServiceUrl + result["Pets"][index].URI;
          }
        }

        console.log("refresh_one_by_one");
        console.log(urls);
        console.log("/refresh_one_by_one");

        this.petsService.getPets(urls).subscribe((pets: any) => {
          this.pets = pets;
          this.dataSource = new MatTableDataSource(this.pets);
        });

        this.hostnames = result["Hostnames"];
        for (let index = 0; index < this.hostnames.length; index++) {
          const element = this.hostnames[index];
          if (element.Service == "pets") {
            continue;
          }
          this.petsService
            .getConfig(this.config.petServiceUrl)
            .pipe(map((result) => result))
            .subscribe((result) => {
              this.configuration = result;
              console.log("configuration");
              console.log(this.configuration);
              console.log("/configuration");
              this.dataSourceConfiguration = new MatTableDataSource<PetsConfig>(
                this.configuration
              );
            });
        }
        console.log("--->");
        console.log(this.configuration);
        console.log("<---");

        this.env = this.config.stage;
        this.env_color = this.config.stage_color;
      });
  }
}
