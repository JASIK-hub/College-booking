import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/features/auth/services/user.service';
import { ENV_KEYS } from 'src/core/config/env-keys';
import { RoleEnum } from 'src/core/db/enums/role.enum';
import { Injectable } from '@nestjs/common';
export interface Teacher {
  email: string;
  name: string;
  role: string;
}
@Injectable()
export class FetchSheetsService {
  private spreadsheetId: string | undefined;
  private sheetName: string | undefined;
  private usersCache: any[] = [];
  private lastFetch = 0;
  constructor(
    private config: ConfigService,
    private userService: UserService,
  ) {
    this.spreadsheetId = this.config.get(ENV_KEYS.SPREADSHEET_ID);
  }

  async fetchGoogleSheet(): Promise<Teacher[]> {
    const url = `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/gviz/tq?tqx=out:json&sheet=${this.sheetName}`;
    const res = await fetch(url);
    const text = await res.text();

    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows;
    const dataRows = rows.slice(1);
    const teachers = await Promise.all(
      dataRows.map(async (row: any) => {
        const name = row.c[0]?.v as string;
        const email = row.c[1]?.v as string;
        const roleStr = row.c[2]?.v as string;

        const role: RoleEnum =
          RoleEnum[roleStr.toUpperCase() as keyof typeof RoleEnum];

        const user = await this.userService.upsertUser({ email, name, role });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }),
    );

    return teachers;
  }

  async getUsers() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (!this.usersCache.length || now - this.lastFetch > oneHour) {
      this.usersCache = await this.fetchGoogleSheet();
      this.lastFetch = now;
    }

    return this.usersCache;
  }
}
