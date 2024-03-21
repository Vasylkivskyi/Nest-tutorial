import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        UsersModule,
        DatabaseModule,
        EmployeesModule,
        // Requests can be made with the limit: 40 per 1 minute and 1 per 1 second
        ThrottlerModule.forRoot([
            {
                name: 'long',
                ttl: 60000, // time to life
                limit: 40, // allows to make 3 requests per minute
            },
            {
                name: 'short',
                ttl: 1000,
                limit: 1,
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
