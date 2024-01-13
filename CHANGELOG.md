## [1.5.2](https://github.com/rhidium/core/compare/v1.5.1...v1.5.2) (2024-01-13)


### Bug Fixes

* live debugging of dynamic component ids ([2ccf0f1](https://github.com/rhidium/core/commit/2ccf0f1195a9ef6f9c9da259c1db4cdaeccf088e))

## [1.5.1](https://github.com/rhidium/core/compare/v1.5.0...v1.5.1) (2024-01-13)


### Bug Fixes

* properly resolve dynamic component id ([d0bb38b](https://github.com/rhidium/core/commit/d0bb38b09b547058753401aac6e6d3b7d52bfdcf))

# [1.5.0](https://github.com/rhidium/core/compare/v1.4.0...v1.5.0) (2024-01-13)


### Features

* live debugging for dynamic component ids ([95bb7ef](https://github.com/rhidium/core/commit/95bb7ef9797e126bc165d151e6e62c6b15aa4ab6))

# [1.4.0](https://github.com/rhidium/core/compare/v1.3.0...v1.4.0) (2024-01-13)


### Features

* test commit, trigger release npm workflow ([1d57aee](https://github.com/rhidium/core/commit/1d57aee0d51a93eb5f682109565ccf3670e98c1a))

# [1.3.0](https://github.com/rhidium/core/compare/v1.2.2...v1.3.0) (2024-01-13)


### Features

* try command for dynamic component ids (@) ([1fc91db](https://github.com/rhidium/core/commit/1fc91db297723467d0cb0cd11eb725d8e4b89db6))

## [1.2.2](https://github.com/rhidium/core/compare/v1.2.1...v1.2.2) (2023-12-27)


### Bug Fixes

* set required in auto complete option constructor ([7516f0c](https://github.com/rhidium/core/commit/7516f0cbfce72dbcedde090559309480a19ae0e9))

## [1.2.1](https://github.com/rhidium/core/compare/v1.2.0...v1.2.1) (2023-12-26)


### Bug Fixes

* bad resolve of commandId for modal submits ([c9cab00](https://github.com/rhidium/core/commit/c9cab00ea5b526eda5a97fe5c05d46d0e742f119))

# [1.2.0](https://github.com/rhidium/core/compare/v1.1.6...v1.2.0) (2023-12-08)


### Features

* **QueueManager:** process first item when full, more callbacks ([43e3442](https://github.com/rhidium/core/commit/43e3442f40193de182062462e6610518ab947d4c))

## [1.1.6](https://github.com/rhidium/core/compare/v1.1.5...v1.1.6) (2023-11-29)


### Bug Fixes

* use preferFollowUp regardless of interaction replied/deferred state ([5a7fc37](https://github.com/rhidium/core/commit/5a7fc370086bf514ddf85ed1d7fe596a4eaea0b5))

## [1.1.5](https://github.com/rhidium/core/compare/v1.1.4...v1.1.5) (2023-11-24)


### Bug Fixes

* exclude default NS for Intellisense ([d3f149b](https://github.com/rhidium/core/commit/d3f149b4bde8fe2ffc83e0eced665126c67fb014))

## [1.1.4](https://github.com/rhidium/core/compare/v1.1.3...v1.1.4) (2023-11-24)


### Bug Fixes

* **Localizations:** explicit lib namespace for client#I18N ([a75a888](https://github.com/rhidium/core/commit/a75a88852d902204d8e0549d348e587edca4558f)), closes [client#I18](https://github.com/client/issues/I18)

## [1.1.3](https://github.com/rhidium/core/compare/v1.1.2...v1.1.3) (2023-11-24)


### Bug Fixes

* permLevel throttleUsage threshold ([562123e](https://github.com/rhidium/core/commit/562123e37801c0715d2512253939b58cf12cdad9))
* use client I18N ref for localizations ([c782c1f](https://github.com/rhidium/core/commit/c782c1f4ef19eeac6b4a055a337e6183b257c44c))

## [1.1.2](https://github.com/rhidium/core/compare/v1.1.1...v1.1.2) (2023-11-24)


### Bug Fixes

* **Lang:** use addResourceBundle ([d45fc75](https://github.com/rhidium/core/commit/d45fc75df1854e94dab924111c32e39582a24ea4))

## [1.1.1](https://github.com/rhidium/core/compare/v1.1.0...v1.1.1) (2023-11-24)


### Bug Fixes

* **AutoComplete:** allow to be used in AutoComplete interactions ([dadf2ea](https://github.com/rhidium/core/commit/dadf2ea2fdcefd38fc2478454a668e6104853aeb))
* only throttle command usage for low-perm level users ([966fa96](https://github.com/rhidium/core/commit/966fa964b4e5146ac7900101bb042aae6227ad11))
* **TimeUtils:** msToHumanReadable, fix wrong arr operation ([6724a32](https://github.com/rhidium/core/commit/6724a3292dca4682e8a1f86bd82c043a3810de98))

# [1.1.0](https://github.com/rhidium/core/compare/v1.0.0...v1.1.0) (2023-11-22)


### Bug Fixes

* avoid double unix timestamp conversion ([59f36ed](https://github.com/rhidium/core/commit/59f36edf727c908816da5ef3e6dca96899c1c779))
* remove check Lang is initialized ([dd893df](https://github.com/rhidium/core/commit/dd893dfd658419625bde1ae53b1572cdb7811721))
* wrong localization value ([774a327](https://github.com/rhidium/core/commit/774a32757e2b1c6c8b1c547d44362d222a2c1448))


### Features

* use add option handler for slash confirm option ([60aa97b](https://github.com/rhidium/core/commit/60aa97bd6c7259f1af7c4da848864e200152c2e6))

# 1.0.0 (2023-11-15)


### Bug Fixes

* **AutoCompleteOption:** add missing #set calls in #addOptionHandler ([e7d3576](https://github.com/rhidium/core/commit/e7d357655445b4ec9bc220c831813e602e8123e0))
* avoid instance checking for official modules ([5dbd49b](https://github.com/rhidium/core/commit/5dbd49bfedd04e972c3a9e9ac8366af3acd23397))
* duplicate [@rhidium](https://github.com/rhidium) prefix ([53d18fe](https://github.com/rhidium/core/commit/53d18fe3ef811d75d1ef3db1249318669f4beb13))
* exclude modules from initial component load ([7ea5e66](https://github.com/rhidium/core/commit/7ea5e665127cc6710e305a9e3f358c6f791c43a5))
* explicit only initialize Lang once ([e4ce1df](https://github.com/rhidium/core/commit/e4ce1dfff35dc4c89eb0f8fcff652f845027d9d0))
* improve error feedback for module version mis-match ([1d0f8e1](https://github.com/rhidium/core/commit/1d0f8e1e60b94c8e01071c3c883d70f375be22d4))
* **Job:** provide Ready client in #run ([05d90d6](https://github.com/rhidium/core/commit/05d90d6b46fb312eb5b4ca4cd6bd8c0aacf18eb8))
* populate/update reference to module to be used in callbacks ([c7163ef](https://github.com/rhidium/core/commit/c7163efa36879cf4db557665a27249a9713914a7))
* remove WIP modules ([93548de](https://github.com/rhidium/core/commit/93548deb3864aa40713678c2bf89ecd83e0fe9a4))
* test publish ([6d3774b](https://github.com/rhidium/core/commit/6d3774ba78edac042da0070e0bd7c019ee71a2ee))
* update Client<boolean> references, djs update ([8078303](https://github.com/rhidium/core/commit/8078303603d1d8535ec944f1f18f700f8e24af21))


### Features

* add strict instanceof checking back in ([1ec7822](https://github.com/rhidium/core/commit/1ec78223a0107dc6757f1c5db796ce319da3a417))
* allow local module development / npm link ([b760fe2](https://github.com/rhidium/core/commit/b760fe28b7c1d51512e1a572e0447bccca6829fc))
* confirmation handlers for interactions ([0e38815](https://github.com/rhidium/core/commit/0e388153b380604e89d3eb552b7be7da06656fe2))
* distinguish between public and private modules ([755feb1](https://github.com/rhidium/core/commit/755feb1d0f00debb21b0d88019dd86bfe251d865))
* dutch locale ([a1ef303](https://github.com/rhidium/core/commit/a1ef303699b403fc5de3a3730a15ca5f06e2dd1b))
* **Embeds:** add extraction utilities for custom title+desc ([a62582b](https://github.com/rhidium/core/commit/a62582bcf4ef504fa210c78848511e7c9dfc6530))
* include full dutch localizations ([99b40c9](https://github.com/rhidium/core/commit/99b40c98c5c04e9e0b2326902a0223a977559c6a))
* include Module in CommandType ([48b9b00](https://github.com/rhidium/core/commit/48b9b0022c1fda8a143d1be79cca85df42a551e7))
* initial commit ([b73f1fd](https://github.com/rhidium/core/commit/b73f1fdc43a842aa34a29e30573e903426610cf6))
* module instance debugging ([6cddb60](https://github.com/rhidium/core/commit/6cddb60123dbc63a03cca32b2be7b124776e5ade))
* **Modules:** localize modules ([fc3d83d](https://github.com/rhidium/core/commit/fc3d83d4f982b168fbddce8925e40a29b659ce35))
* npm+private modules ([bbaffe9](https://github.com/rhidium/core/commit/bbaffe9c6adc20421c7eb401d771157757d2fa77))
* **Permissions:** add #uniqueCommandPermissions to Utils ([cd77455](https://github.com/rhidium/core/commit/cd774557af27c74d7f5e8b35e36c4bcaa5cb086b))
* remove instanceof checking, allow development of local modules ([c54e604](https://github.com/rhidium/core/commit/c54e6048d1251a266d08b4ef73453cff9537b315))
* rework module loading and component backtracing ([6bfbeee](https://github.com/rhidium/core/commit/6bfbeeea5ef08beb27968817fc07c50c5b385c5f))
* standalone localization for modules ([046aa11](https://github.com/rhidium/core/commit/046aa117a4492870127d3ece6d504ee68ff696e3))
* use local npm links in dev mode ([3975386](https://github.com/rhidium/core/commit/3975386cd4e7af479644054bfca49d0836fa3db8))
