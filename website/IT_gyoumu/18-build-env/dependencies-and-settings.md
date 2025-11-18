---
sidebar_position: 4
description: 依存関係とか設定など
---

# プロジェクトをつくる
Sping Bootスタータープロジェクトに必要事項を入れて作成してください

## 最初に作っておかないとまず動かないファイル

何がどのような記述でどうなったのか愛をこめてコメントを添えておくのでそれでなんとか何してるか理解してください。一応きれいに解説したつもりです。実際にpom.xmlを作る場合は下に示したものを丸ごとコピペせず、Githubに置いてるテスト用プロジェクトを使ってください。

# Pom.xml

:::info
pom.xmlとはMavenでどのライブラリを使用するかの宣言を行うファイルです。Project Object modelの頭文字をとっています。このファイル内でプロジェクトを動かす上で必要なものを書いているファイルだと思っておいてください。
:::

```xml
<?xml version="1.0" encoding="UTF-8"?><!-- エンコード方式とxmlバージョンの宣言 -->
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.1.1</version>
		<relativePath/> 
	</parent>
	
	<groupId>com.example</groupId>    <!-- グループID-->
	<artifactId>test</artifactId>    <!-- アーティファクトID -->
	<version>0.0.1-SNAPSHOT</version>  <!-- バージョン宣言-->
	<name>test</name>  <!-- 表示名 -->
	<description>Demo project for Spring Boot</description>  <!--プロジェクトの説明の指定 -->
	
	<properties>  <!-- プロパティの指定-->
		<java.version>20</java.version>  <!-- javaのバージョン宣言 -->
	</properties>
	
	<dependencies>  <!-- 要素の列挙 -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-thymeleaf</artifactId>
		</dependency>
		
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
		</dependency>
		
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		
		<dependency><!-- My_SQLの宣言-->
			<groupId>com.mysql</groupId>
			<artifactId>mysql-connector-j</artifactId>
			<scope>runtime</scope>
		</dependency>
		
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		
		<dependency>
			<groupId>org.thymeleaf.extras</groupId>
			<artifactId>thymeleaf-extras-springsecurity6</artifactId>
		</dependency>
		
		<!-- JSP サポート -->
		<dependency>
			<groupId>org.apache.tomcat.embed</groupId>
			<artifactId>tomcat-embed-jasper</artifactId>
		</dependency>
		
		<dependency>
			<groupId>org.glassfish.web</groupId>
			<artifactId>jakarta.servlet.jsp.jstl</artifactId>
		</dependency>
	</dependencies>
	
	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<excludes>
						<exclude>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
						</exclude>
					</excludes>
					<mainClass>com.example.demo.TestApplication</mainClass>
				</configuration>
			</plugin>
		</plugins>
	</build>
</project>
			
```