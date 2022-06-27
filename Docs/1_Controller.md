# Controller
- MVC 패턴의 컨트롤러.
- request를 받고, response를 리턴하는 **인터페이스**


```tsimport { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```
- @Controller 데코레이터를 클래스에 선언하여 컨트롤러의역할을 하게 됨

### 라우팅
엔드포인트 라우팅 메커니즘으로 요청 분류
### prefix
- @Controller('prefix')
- 와일드 카드 : @Get('he*lo') - ex) helo , hello, he__lo
  * \* 외에 ?, +, () 문자 역시 정규 표현식에서의 와일드 카드와 동일하게 동작
  * 단, 하이픈(-)과 점(.)은 문자열로 취급합니다. 즉, @Get('he.lo') 는 hello 로 요청할 수 없습니다.


### 요청 객체 (request Object)
- nest는 요청과 함께 전달되는 데이터를 핸들러(요청을 처리할 구성요소, 컨트롤러의 역할)가 다룰 수 있는 객체로 변환하다.
- 변환된 객체는 @Req() 데코레이터를 이용해서 다룰 수 있다.

```
import { Controller, Get, Req } from "@nestjs/common";
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('req')
  getRequest(@Req() req: Request): string {
    console.log(req)
    return this.appService.getHello();
  }
}

```
보통은 @Query(), @Param(key?: string) , @Body 데코레이터 이용

## 응답
- 객체를 리턴한다면 직렬화를 통해 JSON 으로 자동 변환
- 라이브러리별 응답 객체를 직접 다룰 수도 있습니다. 
  - 예를 들어 Express를 사용한다면 Express response object를 @Res 데코레이터를 이용해서 다룰 수 있습니다.
    ```ts
    @Get()
    findAll(@Res() res) {
      const users = this.usersService.findAll()
      return res.status(200).send(users);
    }```
    
### @httpCode
```ts
import { HttpCode } from '@nestjs/common';

@HttpCode(202)
@Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(+id, updateUserDto);
}
```

### 헤더
- 응답헤더도 자동 구성할 수 있다.
#### @Header() 
- 커스텀 헤더 추가
```ts
import { Header } from '@nestjs/common';

@Header('Custom', 'Test Header')
@Get(':id')
findOneWithHeader(@Param('id') id: string) {
  return this.usersService.findOne(+id);
}
```
- res.header() 메서드로 직접 설정도 가능
- terminal-> curl http://localhost:5377/1 -v (header 옵션 확인)

```
*   Trying 127.0.0.1:5377...
* Connected to localhost (127.0.0.1) port 5377 (#0)
> GET /1 HTTP/1.1
> Host: localhost:5377
> User-Agent: curl/7.79.1
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Custom: Test Header
< Content-Type: text/html; charset=utf-8
< Content-Length: 3
< ETag: W/"3-NEJJa5bdAVkajNRLHuwTaKtyiro"
< Date: Thu, 23 Jun 2022 00:18:28 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
* Connection #0 to host localhost left intact
str%                                   
```

## 리디렉션
요청을 처리한 후 요청을 보낸 클라이언트를 다른 페이지로 이동 시키고 싶을 경우
### @Redirect(url, 상태코드)
```ts
import { Redirect } from '@nestjs/common';
// . 301 Moved Permanatly
@Redirect('https://nestjs.com', 301)
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(+id);
}
```

**Example**

쿼리 파라미터로 버전 숫자를 전달받아 해당 버전의 페이지로 이동

```ts
@Get('redirect/docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

## 라우트 파라미터 (패스 파라미터)
### @Param()
#### 객체로 한번에 받기
- 파라미터가 여러 개 전달되는 경우
```ts
@Delete(':userId/memo/:memoId')
deleteUserMemo(@Param() params: { [key: string]: string }) {
  return `userId: ${params.userId}, memoId: ${params.memoId}`;
}
```
- 파라미터 타입이 항상 string이기때문에 명시적으로 지정해도 된다.

#### 각각 따로 받기 (일반적)
- 라우팅 파라미터의 개수가 너무 많아지지 않게 설계하는 것이 좋기 때문에 괜찮다.
```ts
@Delete(':userId/memo/:memoId')
deleteUserMemo(
@Param('userId') userId: string,
@Param('memoId') memoId: string,
) {
return `userId: ${userId}, memoId: ${memoId}`;
}
```

## 하위도메인(sub-Domain) 라우팅
### Usage
- http://example.com, http://api.example.com로 들어온 요청을 서로 다르게 처리
- 하위 도메인에서 처리하지 못하는 요청은 원래 도메인에서 처리하도록 한다

### 실습
- nest g co Api

#### ApiController가 AppController보다 먼저 처리되도록 순서 수정
```ts
@Module({
  controllers: [ApiController, AppController],
    ...
})
export class AppModule { }
```

#### ControllerOptions 객체 작성
- host 속성에 하위 도메인 기술
```ts
@Controller({ host: 'api.example.com' }) // local 테스트 시 api.localhost
export class ApiController {
  @Get() // 같은 루트 경로
  index(): string {
    return 'Hello, API'; // 다른 응답
  }
}
```

* 로컬 테스트
  * /etc/hosts 파일에 **127.0.0.1 api.localhost** 추 후 서버 재시작
  * http://api.localhost:5377 요청 시 Hello, API 확인
  

### @HostParam()
- 서브도메인을 변수로 받을 수 있음
- API 버저닝은 보통 하위 도메인을 많이 이용한다
### 실습
nest g co VersionApi

```ts
@Controller({ host: ':version.api.localhost' })
export class VersionApiController {
  @Get()
  index(@HostParam('version') version: string): string {
    return `Hello, API ${version}`;
  }
}
```
