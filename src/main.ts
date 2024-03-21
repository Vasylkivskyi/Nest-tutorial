import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilrer } from './all-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilrer(httpAdapter));
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.listen(3000);
}
bootstrap();
