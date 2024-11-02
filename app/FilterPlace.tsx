import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setPlaces, setFilter, setMap } from "@/store/slices/posts";
import * as SecureStore from "expo-secure-store";


// import {placesFilter} from "@/assets/data/placesFilter"
const FilterPlace = () => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isItReturnBack, setReturn] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const placesFilter = [
    {
      name: t("amman"),
      coordinate: {
        lat: 31.9404746,
        long: 35.9670126,
      },
      places: [
        {
          name: t("Shmeisani"),
          lat: 31.9726754047646,
          long: 35.8954681644199,
        },
        {
          name: t("Abdoun"),
          lat: 31.941823926739,
          long: 35.8867914081465,
        },
        {
          name: t("Abu Al - Sous"),
          lat: 31.9157421033479,
          long: 35.7771974762362,
        },
        {
          name: t("Shafa Badran - Hai Al Kom"),
          lat: 32.0336976950948,
          long: 35.9597520850973,
        },
        {
          name: t("Rabwat Abdoun"),
          lat: 31.9261810772103,
          long: 35.8801813380594,
        },
        {
          name: t("Abdoun Corridor"),
          lat: 31.9212513241371,
          long: 35.8690846279004,
        },
        {
          name: t("Sweifieh"),
          lat: 31.9514653119812,
          long: 35.8636243236291,
        },
        {
          name: t("Alrabiyeh"),
          lat: 31.9762675162313,
          long: 35.8769571835405,
        },
        {
          name: t("Um Uthayna"),
          lat: 31.9659982506589,
          long: 35.8724348409622,
        },
        {
          name: t("Al Salehien"),
          lat: 31.9831826367253,
          long: 35.8595306757526,
        },
        {
          name: t("Daheyat Al Nakheel"),
          lat: 31.9016011315559,
          long: 35.8597943014452,
        },
        {
          name: t("Daheyat Al-Aqsa"),
          lat: 31.9810340844184,
          long: 35.9372175788322,
        },
        {
          name: t("Daheyat Al Ameer Hasan"),
          lat: 31.9801969745119,
          long: 35.9263306632065,
        },
        {
          name: t("Daheyat Al Istiqlal"),
          lat: 31.9747104300896,
          long: 35.9427163378759,
        },
        {
          name: t("Um Al Sumaq"),
          lat: 31.9792599783966,
          long: 35.8502089780569,
        },
        {
          name: t("Khalda"),
          lat: 31.9986751324795,
          long: 35.8452607106225,
        },
     
        {
          name: t("Gardens - Wasfi Altal street"),
          lat: 31.9881294055518,
          long: 35.8847677803112,
        },
        {
          name: t("Tla Al Ali"),
          lat: 32.0045958396902,
          long: 35.8626371738402,
        },
        {
          name: t("University of Jordan"),
          lat: 32.0112098072526,
          long: 35.8712186866218,
        },
        {
          name: t("Al Diray - Deir Ghbar"),
          lat: 31.9387333078943,
          long: 35.8603518595382,
        },
        {
          name: t("Dabouq"),
          lat: 31.9903039057912,
          long: 35.811241290185,
        },
        {
          name: t("Al Kamalyah"),
          lat: 32.0332667531994,
          long: 35.8108098813218,
        },
        {
          name: t("Al Jandawil"),
          lat: 31.9622917757551,
          long: 35.8377429722231,
        },
        {
          name: t("Jabal Amman"),
          lat: 31.9511326658586,
          long: 35.9173880236752,
        },
        {
          name: t("Al Bayader"),
          lat: 31.9509321302899,
          long: 35.8321934434796,
        },
        {
          name: t("Alabdali"),
          lat: 31.9630167516792,
          long: 35.9170041024616,
        },
        {
          name: t("Alweibdeh"),
          lat: 31.9572442993024,
          long: 35.9222399995551,
        },
        {
          name: t("Al kursi"),
          lat: 31.9638962463301,
          long: 35.8273186712897,
        },
        {
          name: t("Alsahel"),
          lat: 31.9455556642725,
          long: 35.8534876620006,
        },
        {
          name: t("Al Jwaideh"),
          lat: 31.8905998811649,
          long: 35.9425365671827,
        },
        {
          name: t("Alrawabi"),
          lat: 31.962904569376,
          long: 35.8581133516974,
        },
        {
          name: t("Daheyat Al Ameer Rashed - Alrawabi"),
          lat: 31.9665522264817,
          long: 35.8492340578369,
        },
        {
          name: t("Alsena'a - Al Bayader"),
          lat: 31.9366807325951,
          long: 35.8340802676335,
        },
        {
          name: t("Al Sahabah"),
          lat: 31.9153258981622,
          long: 35.8735774588214,
        },
        {
          name: t("Hai Al Sahaba"),
          lat: 31.9157095576939,
          long: 35.8734976797058,
        },
        {
          name: t("Althahir"),
          lat: 31.9216771921683,
          long: 35.8488484054707,
        },
        {
          name: t("Marj Alhamam"),
          lat: 31.9001102045053,
          long: 35.8450453120856,
        },
        {
          name: t("Jabal Alhussien"),
          lat: 31.9659328418183,
          long: 35.9214975333537,
        },
        {
          name: t("Jabal Al Akhdar"),
          lat: 31.9381540808266,
          long: 35.9112801794942,
        },
        {
          name: t("Almadinah Alroyadiyah"),
          lat: 31.9888615875376,
          long: 35.9072661329419,
        },
        {
          name: t("Dahiyet Alrasheed"),
          lat: 32.0079869655145,
          long: 35.8905390551018,
        },
        {
          name: t("Dahiyet Prince Ali"),
          lat: 31.8603138104072,
          long: 35.9070353825768,
        },
        {
          name: t("Sweileh"),
          lat: 32.0237082401795,
          long: 35.8446178520652,
        },
        {
          name: t("Alridwan"),
          lat: 31.9611094638284,
          long: 35.8897146764803,
        },
        {
          name: t("First Circle"),
          lat: 31.9494912122596,
          long: 35.9245791287757,
        },
        {
          name: t("Second Circle"),
          lat: 31.9517057058083,
          long: 35.9147455852139,
        },

        {
          name: t("Fourth Circle"),
          lat: 31.9540741034075,
          long: 35.897412020502,
        },
        {
          name: t("Fifth Circle"),
          lat: 31.9606719139052,
          long: 35.8849271941251,
        },
        {
          name: t("Sixth Circle"),
          lat: 31.959677505266,
          long: 35.8728369887459,
        },
        {
          name: t("Seventh Circle"),
          lat: 31.9631660233767,
          long: 35.8575689437034,
        },
        {
          name: t("Eighth Circle"),
          lat: 31.9582228937581,
          long: 35.845467768861,
        },
        {
          name: t("Wadi Saqra street"),
          lat: 31.9601999308279,
          long: 35.8996573187594,
        },
        {
          name: t("Alandalus"),
          lat: 31.8837988115838,
          long: 35.9179358457784,
        },
        {
          name: t("Shafa Badran"),
          lat: 32.0475904135832,
          long: 35.9305200501237,
        },
        {
          name: t("birayn"),
          lat: 32.132388598726,
          long: 35.9714326656333,
        },

        {
          name: t("Abu Nseir"),
          lat: 32.0609288003387,
          long: 35.8806913960888,
        },
        {
          name: t("Tabarbour"),
          lat: 32.0103281983307,
          long: 35.9510484598612,
        },

        {
          name: t("Raghadan"),
          lat: 31.981075135968,
          long: 35.9520211057594,
        },
        {
          name: t("Marka"),
          lat: 31.9816674304593,
          long: 36.0062464575094,
        },
        {
          name: t("Marka"),
          lat: 31.9566673914269,
          long: 36.0169547378468,
        },
        {
          name: t("Al Hashmi -al Shamali"),
          lat: 31.9739452573661,
          long: 35.9567221435832,
        },
        {
          name: t("Al Hashmi -Al Janobi"),
          lat: 31.9633703351159,
          long: 35.951969369246,
        },
        {
          name: t("Jabal Al Jofah"),
          lat: 31.9548756606836,
          long: 35.9498155910905,
        },
        {
          name: t("Ohud"),
          lat: 31.9362491833313,
          long: 36.113759192235,
        },
        {
          name: t("Al - Muwqqar"),
          lat: 31.8090841281325,
          long: 36.1219093152512,
        },
        {
          name: t("Al - Nuqairah"),
          lat: 31.838944523774,
          long: 36.0483860571112,
        },
        {
          name: t("Sahab"),
          lat: 31.8631493488791,
          long: 36.0001231710485,
        },
        {
          name: t("Abu Alanda"),
          lat: 31.9140255073913,
          long: 35.975197551378,
        },
        {
          name: t("AL Quwaysimah"),
          lat: 31.9046199235228,
          long: 35.9578822253141,
        },
        {
          name: t("Al Oroubah"),
          lat: 31.9210405190763,
          long: 35.9756749818532,
        },
        {
          name: t("Umm Nowarah"),
          lat: 31.929493329075,
          long: 35.9621988501705,
        },
        {
          name: t("Al Rabwa"),
          lat: 31.9512613226003,
          long: 35.9886356549274,
        },
        {
          name: t("Al Amira Alia"),
          lat: 31.9383013992762,
          long: 35.9789780553779,
        },
        {
          name: t("Al Manarah"),
          lat: 31.9440640533599,
          long: 35.9617864099276,
        },
        {
          name: t("Umm Al Amad"),
          lat: 31.793487415444,
          long: 35.9117291984619,
        },
        {
          name: t("Al Zaytouneh"),
          lat: 31.7529257377745,
          long: 35.8949393798115,
        },
        {
          name: t("Manja"),
          lat: 31.7430861762299,
          long: 35.8563983887336,
        },
        {
          name: t("Al Qastal"),
          lat: 31.7456037145509,
          long: 35.9367684365631,
        },
        {
          name: t("Al Tuneib"),
          lat: 31.8131389365713,
          long: 35.9307835544787,
        },
        {
          name: t("Al Lubban"),
          lat: 31.8203358452476,
          long: 35.9663683523562,
        },
        {
          name: t("Al Taqwa"),
          lat: 31.867319241723,
          long: 35.9680569806428,
        },
        {
          name: t("Al Iman"),
          lat: 31.8714610843818,
          long: 35.9453952381779,
        },
        {
          name: t("Jawa"),
          lat: 31.8570978898858,
          long: 35.9429703988313,
        },
        {
          name: t("Al Yadudah"),
          lat: 31.843777161183,
          long: 35.9107729593241,
        },
        {
          name: t("Al Abrar"),
          lat: 31.8347799017502,
          long: 35.9010120332599,
        },
        {
          name: t("Ghamadan"),
          lat: 31.8532304134266,
          long: 35.9014474461261,
        },
        {
          name: t("Umm Al Kundum"),
          lat: 31.8639833967684,
          long: 35.8809547327621,
        },
        {
          name: t("Naur"),
          lat: 31.861627504898,
          long: 35.823174866395,
        },
        {
          name: t("Salihiyat Al Abid"),
          lat: 31.9521103967343,
          long: 36.0084005913553,
        },
        {
          name: t("Iraq Al Amir"),
          lat: 31.9220157759051,
          long: 35.7355242320451,
        },
        {
          name: t("Al Muqabalein"),
          lat: 31.9084182826513,
          long: 35.9151751285091,
        },
        {
          name: t("Al Yasmin"),
          lat: 31.917236028368,
          long: 35.8910531744121,
        },
        {
          name: t("Al Zohour"),
          lat: 31.9242396044549,
          long: 35.9207004900968,
        },
        {
          name: t("Al Jubeiha - Al Rayyan"),
          lat: 32.0370309555205,
          long: 35.8727894852221,
        },
        {
          name: t("Al Jubeiha - Umm Zuwaytinah"),
          lat: 32.0335608762804,
          long: 35.8891507357213,
        },
        {
          name: t("Umm A Usoud"),
          lat: 31.9809178564553,
          long: 35.7980383401822,
        },
        {
          name: t("Badr AjJadidah"),
          lat: 31.9578926100777,
          long: 35.7780595718905,
        },
        {
          name: t("Al Hummar"),
          lat: 32.0106809980355,
          long: 35.817596868471,
        },
        {
          name: t("Al Forousyah"),
          lat: 32.0209968867661,
          long: 35.8074382582414,
        },
        {
          name: t("Al Jubeiha - Al Mansour"),
          lat: 32.0178900015489,
          long: 35.9116625075289,
        },
        {
          name: t("Umm Al Hiran"),
          lat: 31.9088920748829,
          long: 35.9437186543779,
        },
        {
          name: t("Al Rawda"),
          lat: 31.9180886276539,
          long: 35.9181871984108,
        },
        {
          name: t("Al Thra"),
          lat: 31.9335275561434,
          long: 35.9087794665798,
        },
        {
          name: t("Al Akhdar - Nazzal"),
          lat: 31.9373651566636,
          long: 35.908395755426,
        },
        {
          name: t("Al Hilal"),
          lat: 31.9311797778966,
          long: 35.8957160433312,
        },
        {
          name: t("Al Humranyah"),
          lat: 31.9215911557346,
          long: 35.904229711052,
        },
        {
          name: t("Al Bunayyat-Al Janubiyah"),
          lat: 31.887157017132,
          long: 35.8818560920693,
        },
        {
          name: t("Al Bunayyat-Al Shamali"),
          lat: 31.8924792811981,
          long: 35.8977106461161,
        },
        {
          name: t("Al Furqn"),
          lat: 31.8766792339156,
          long: 35.8953389219925,
        },
        {
          name: t("Al Jubeiha"),
          lat: 32.0234892409049,
          long: 35.8886586172869,
        },
        {
          name: t("Sweileh-Al Hai Al Sharqi"),
          lat: 32.0297865671745,
          long: 35.8457626334808,
        },
        {
          name: t("Prince Hassan District"),
          lat: 31.9849151040254,
          long: 35.9265477663889,
        },
        {
          name: t("Jabal Al Nuzha"),
          lat: 31.9735902967093,
          long: 35.9261268369576,
        },
        {
          name: t("Jabal Al Taj"),
          lat: 31.949146929336,
          long: 35.9495995868466,
        },
        {
          name: t("Al Nathif"),
          lat: 31.9364586605396,
          long: 35.927060091266,
        },
        {
          name: t("Al Ashrafyeh"),
          lat: 31.9407384853228,
          long: 35.9370054309122,
        },
        {
          name: t("AlWehdat"),
          lat: 31.9296491426366,
          long: 35.9394833354058,
        },
        {
          name: t("Abdun-Abdun Al Janobi"),
          lat: 31.9389153444506,
          long: 35.8872872295763,
        },
        {
          name: t("Abdun-Abdun Al Shmali"),
          lat: 31.9480217202042,
          long: 35.8899510374522,
        },
        {
          name: t("Al Rawnaq"),
          lat: 31.9512860882803,
          long: 35.8424123410396,
        },
        {
          name: t("Al Jizah"),
          lat: 31.7026884830741,
          long: 35.970688529043,
        },
        {
          name: t("Jelul"),
          lat: 31.7141477737507,
          long: 35.8476883258223,
        },
        {
          name: t("Husban - Um al Basateen"),
          lat: 31.8131409473141,
          long: 35.7986759051443,
        },
        {
          name: t("Tareq -Abu Alia"),
          lat: 32.0138480847641,
          long: 35.9776858620819,
        },
        {
          name: t("Tareq -Al Shahid Al Shamali"),
          lat: 31.9958149290402,
          long: 35.9638069668051,
        },
        {
          name: t("Tareq -Al Shahid Al Janobi"),
          lat: 31.9862687434467,
          long: 35.9641037730086,
        },
        {
          name: t("Tareq -Ayn Ghazal"),
          lat: 31.9988609570695,
          long: 35.9798598420999,
        },
        {
          name: t("Tareq -Ayn Rbat"),
          lat: 32.0106247174999,
          long: 35.9864661305274,
        },
        {
          name: t("Tareq -Al Feisal"),
          lat: 32.0158617023667,
          long: 35.9770942896958,
        },
        {
          name: t("Al Abdaliyah"),
          lat: 31.8889911114105,
          long: 36.0149832093992,
        },
        {
          name: t("Dabouq Al Rahmanyeh"),
          lat: 32.0053013859377,
          long: 35.8250875817377,
        },
        {
          name: t("Rujm ash Shami"),
          lat: 31.8283457463258,
          long: 36.0014036444777,
        },
        {
          name: t("Al Jizah - Al Mushatta"),
          lat: 31.7451027154672,
          long: 36.0015396609157,
        },
        {
          name: t("Al Qweismeh - Al Naharyah"),
          lat: 31.9264616025877,
          long: 35.9510589722068,
        },
        {
          name: t("Al Qweismeh - Al Maghaba"),
          lat: 31.8856662418424,
          long: 35.9681399734419,
        },
  
        {
          name: t("Hettin"),
          lat: 31.8899890562335,
          long: 35.9302850276571,
        },
        {
          name: t("Airport Rd"),
          lat: 31.8899221379743,
          long: 35.8746823315402,
        },
        {
          name: t("Marka -Al Tatwir"),
          lat: 31.9895792295651,
          long: 36.0517715102517,
        },
        {
          name: t("Marka Al Shamali"),
          lat: 31.9866717050004,
          long: 35.9886555199404,
        },
        {
          name: t("Marka -Al Zahra"),
          lat: 31.9833445409196,
          long: 35.999455860676,
        },
        {
          name: t("Marka Janobi"),
          lat: 31.9809168187758,
          long: 35.9967956028282,
        },
        {
          name: t("yajouz"),
          lat: 32.0375693232789,
          long: 35.9165936183874,
        },
        {
          name: t("Shafa Badran -Tab Qira"),
          lat: 32.052040328691,
          long: 35.8940212432299,
        },
        {
          name: t("Shafa Badran -Marj Al Furs"),
          lat: 32.0576217308629,
          long: 35.9491191445378,
        },
        {
          name: t("Al Jubeiha Umm Hjair"),
          lat: 32.0413698784752,
          long: 35.8914502477201,
        },
        {
          name: t("Sweileh -Al Fadilah"),
          lat: 32.01861516129,
          long: 35.8561915183901,
        },
        {
          name: t("Badr AjJadidah - Bilal"),
          lat: 31.9632733248005,
          long: 35.792713345135,
        },
        {
          name: t("Badr AjJadidah - Al Ghrous"),
          lat: 31.9640813000163,
          long: 35.7752533328797,
        },
        {
          name: t("West Amman"),
          lat: 31.9645939801354,
          long: 35.87304144209447,
        },
        {
          name: t("Badr AjJadidah - Al Swaisah"),
          lat: 31.9509131036769,
          long: 35.7669507673358,
        },
        {
          name: t("Badr AjJadidah - Zebda"),
          lat: 31.94489796828,
          long: 35.7540185040543,
        },
        {
          name: t("Basman - Al Qusour"),
          lat: 31.961676726302,
          long: 35.9405740489352,
        },
        {
          name: t("Aarjan"),
          lat: 31.9830424925313,
          long: 35.9120325951141,
        },
        {
          name: t("Amman - Down Town"),
          lat: 31.9517030010229,
          long: 35.9358588265967,
        },
        {
          name: t("Amman - Al - Urdon St"),
          lat: 32.0789825181702,
          long: 35.8808280007752,
        },
        {
          name: t("Amman - Al Jumayyil"),
          lat: 31.4479787000326,
          long: 35.8920522438214,
        },
        {
          name: t("Amman - Umm ar-Rasas"),
          lat: 31.5146666245048,
          long: 35.9351095259082,
        },
        {
          name: t("Amman - Daba"),
          lat: 31.574181935502,
          long: 36.0448180461572,
        },
        {
          name: t("Al Jizah - Areinba Al Sharqiyah"),
          lat: 31.6541808871025,
          long: 35.9974675494991,
        },
        {
          name: t("Al Jizah - Al Sayfiyah"),
          lat: 31.6560975736439,
          long: 36.0247197750323,
        },
        {
          name: t("Al Jizah - Al Quneitirah"),
          lat: 31.6974875633004,
          long: 36.0618059539725,
        },
        {
          name: t("Al Jizah - Dhuheibah Al Gharbiyah"),
          lat: 31.7906897435018,
          long: 35.9951337681996,
        },
        {
          name: t("Al Jizah - Al Zafaran"),
          lat: 31.610328847284,
          long: 35.8669645531926,
        },
        {
          name: t("Al jizah - Zeinab"),
          lat: 31.6111929866034,
          long: 35.9223098113215,
        },
        {
          name: t("Al Jizah - Areinba Al Gharbiyah"),
          lat: 31.6364439155644,
          long: 35.9522888358084,
        },
        {
          name: t("Al jizah - Al Heri"),
          lat: 31.6343776386417,
          long: 35.8915129835472,
        },
        {
          name: t("Al Jizah - Netil"),
          lat: 31.6551378570019,
          long: 35.8572965211761,
        },
  
        {
          name: t("Al Jizah - Sufa"),
          lat: 31.6684637668292,
          long: 35.814363235214,
        },
        {
          name: t("Al jizah - Al Hraij"),
          lat: 31.6583657075853,
          long: 35.8416811767418,
        },
        {
          name: t("Al jizah - Umm Quseir"),
          lat: 31.6689092903128,
          long: 35.8958263200122,
        },
        {
          name: t("Al jizah - Zuwayza"),
          lat: 31.6885731803011,
          long: 35.9195796551229,
        },
        {
          name: t("Howarah"),
          lat: 31.6867449822289,
          long: 35.8627763420476,
        },
        {
          name: t("Al Kutaifah"),
          lat: 31.7490653657306,
          long: 36.0885071697247,
        },
        {
          name: t("Umm Rummanah"),
          lat: 31.7355060910397,
          long: 35.8909693773708,
        },
  
        {
          name: t("Safut"),
          lat: 32.0409832475262,
          long: 35.8338700939075,
        },
        {
          name: t("Ein Al -Basha"),
          lat: 32.0659919770139,
          long: 35.8436132488006,
        },
      ],
    },
    {
      name: t("zarqa"),
      coordinate: {
        lat: 32.0523449,
        long: 36.2160829,
      },
      places: [
        {
          name: t("Zarqa -Al Bustan"),
          lat: 32.1042020460587,
          long: 36.0493075544626,
        },
        {
          name: t("Zarqa -Shomar"),
          lat: 32.0853508650104,
          long: 36.0443807600016,
        },
        {
          name: t("Zarqa - AI Jenenah"),
          lat: 32.075692008822,
          long: 36.0574795388764,
        },
        {
          name: t("Zarqa - Al Hashimi"),
          lat: 32.0945969187194,
          long: 36.0720035952156,
        },
        {
          name: t("Zarqa - Al Batrawi"),
          lat: 32.1045173887887,
          long: 36.0921730756682,
        },
        {
          name: t("Zarqa - New Zarqa"),
          lat: 32.0896438383837,
          long: 36.0969133259745,
        },
        {
          name: t("Zarqa - Al Amir Mohammad"),
          lat: 32.0797974064575,
          long: 36.0979561396644,
        },
        {
          name: t("Zarqa - Al Ghwariyah"),
          lat: 32.0736158047857,
          long: 36.0971264311697,
        },
        {
          name: t("Zarqa - Ramzi"),
          lat: 32.079214544519,
          long: 36.0849386168786,
        },
        {
          name: t("Zarqa - Al Amir Shaker"),
          lat: 32.0717657706415,
          long: 36.0777019058324,
        },
        {
          name: t("Zarqa - Al Zawahrah"),
          lat: 32.0696306201969,
          long: 36.0656700687736,
        },
        {
          name: t("Zarqa - Al Jabir"),
          lat: 32.0699532853142,
          long: 36.0552095542332,
        },
        {
          name: t("Zarqa - Al Amirah Haia"),
          lat: 32.0755113576294,
          long: 36.0358434769736,
        },
        {
          name: t("Zarqa - Nassar"),
          lat: 32.0690789918065,
          long: 36.0179381860751,
        },
        {
          name: t("Zarqa - Al Ahmad"),
          lat: 32.0526888978735,
          long: 36.0100921875186,
        },
        {
          name: t("Zarqa - Dhlail"),
          lat: 32.11901231541,
          long: 36.2760522184791,
        },
        {
          name: t("Zarqa - Makka Al Mokarameh"),
          lat: 32.0443912194469,
          long: 36.0214278206626,
        },
        {
          name: t("Zarqa - Al Duweik"),
          lat: 32.0462922598256,
          long: 36.0529172409568,
        },
        {
          name: t("Zarqa - Al Amir Hamza"),
          lat: 32.0540842515701,
          long: 36.0664602867507,
        },
        {
          name: t("Zarqa - Al Jabal Al Abyad"),
          lat: 32.0556723855612,
          long: 36.077861672749,
        },
        {
          name: t("Zarqa - Al Amirah Rahmah"),
          lat: 32.0445459190305,
          long: 36.0777273711943,
        },
        {
          name: t("Zarqa - Al Amir Hassan"),
          lat: 32.0375859189481,
          long: 36.078469082475,
        },
        {
          name: t("Zarqa - Al Malik Talal"),
          lat: 32.0342708292934,
          long: 36.0750436803057,
        },
        {
          name: t("Zarqa - Al Falah"),
          lat: 32.0396616639573,
          long: 36.064143551296,
        },
        {
          name: t("Zarqa - Awajan"),
          lat: 32.0286081398476,
          long: 36.0688905793919,
        },
        {
          name: t("Zarqa - Al Jundi"),
          lat: 32.0276049038819,
          long: 36.0792191694066,
        },
        {
          name: t("Zarqa - Al Masana"),
          lat: 32.0234588099463,
          long: 36.09433760614,
        },
        {
          name: t("Zarqa - Al Thawrah Al Arabia Al Kubrah"),
          lat: 32.043467156684,
          long: 36.0930784128758,
        },
        {
          name: t("Zarqa - Jannaa'ah"),
          lat: 32.0557714064046,
          long: 36.0894643664596,
        },
        {
          name: t("Zarqa - Madinat Al-Sarq"),
          lat: 32.0548813829398,
          long: 36.1180094749498,
        },
        {
          name: t("Zarqa - Al Madinah Al Monawarah"),
          lat: 32.0539801432538,
          long: 36.0475349594079,
        },
        {
          name: t("Zarqa - Al Hashemiya"),
          lat: 32.1332670371599,
          long: 36.1371524934548,
        },
        {
          name: t("Zarqa - Al Dobat"),
          lat: 32.0561612231743,
          long: 36.0870531028376,
        },
        {
          name: t("Zarqa - Jabal Tareq"),
          lat: 32.0417148086703,
          long: 36.099178490783,
        },
        {
          name: t("Zarqa - Abu-Al-Zighan"),
          lat: 32.116543674312,
          long: 36.0458882285887,
        },
        {
          name: t("Zarqa - As-Sukhnah"),
          lat: 32.130989450345,
          long: 36.0721408075896,
        },
  
        {
          name: t("Zarqa - Alghabwi"),
          lat: 32.0555661014594,
          long: 36.1536467908659,
        },
        {
          name: t("Zarqa - Um Rummanah"),
          lat: 32.096581083872,
          long: 35.9279050585194,
        },
  
        {
          name: t("Zarqa - Al-Azraq"),
          lat: 31.7805669080572,
          long: 36.8898415495738,
        },
        {
          name: t("Zarqa - Russeifa"),
          lat: 32.0090844169517,
          long: 36.0231088082425,
        },
      ],
    },
    {
      name: t("BALQA Governorate"),
      coordinate: {
        lat: 32.052697,
        long: 35.7502258,
      },
      places: [
        {
          name: t("Balqa - Yarqa"),
          lat: 31.9713470867514,
          long: 35.6888260397946,
        },
        {
          name: t("Balqa - Abu Hamed"),
          lat: 32.1005385470706,
          long: 35.8736456176336,
        },
        {
          name: t("Balqa - Al Hanou"),
          lat: 32.0979353646397,
          long: 35.8369970536075,
        },
        {
          name: t("Balqa - Umm Njasa"),
          lat: 32.0804567355686,
          long: 35.8048169926436,
        },
        {
          name: t("Balqa - Rememen"),
          lat: 32.1067617040983,
          long: 35.7945277852207,
        },
        {
          name: t("Balqa - Al-Maysarah"),
          lat: 32.1367341489489,
          long: 35.6916770976237,
        },
        {
          name: t("Balqa - Dayr Allah"),
          lat: 32.2024062259946,
          long: 35.6194870710563,
        },
        {
          name: t("Balqa - Ira"),
          lat: 31.9851949226036,
          long: 35.6516445109305,
        },
        {
          name: t("Balqa - Tal Rumman"),
          lat: 32.1670283737929,
          long: 35.8208869393009,
        },
        {
          name: t("Balqa - Dirar"),
          lat: 32.2206973751111,
          long: 35.606037126856,
        },
        {
          name: t("Balqa - Al-Ashrafiyah"),
          lat: 32.1187841889562,
          long: 35.797066514351,
        },
        {
          name: t("Balqa - Allan"),
          lat: 32.1125742315262,
          long: 35.7432156877051,
        },
        {
          name: t("Balqa - Jalaad"),
          lat: 32.1237017736258,
          long: 35.7829424506796,
        },
        {
          name: t("Balqa - Umm Al Amad"),
          lat: 32.1122621225007,
          long: 35.7563711002238,
        },
        {
          name: t("As-Salt - Wadi Al Hour"),
          lat: 32.0721377901899,
          long: 35.7693083770207,
        },
        {
          name: t("As-Salt - Zayy"),
          lat: 32.1083303486561,
          long: 35.7134336025531,
        },
        {
          name: t("As-Salt - As-Subayhi"),
          lat: 32.1565355123029,
          long: 35.7071137386925,
        },
        {
          name: t("As-Salt - Al-Sarw"),
          lat: 32.0576734704916,
          long: 35.7952417831245,
        },
        {
          name: t("As-Salt - Umm Joza"),
          lat: 32.0857253837109,
          long: 35.7364417976434,
        },
        {
          name: t("As-Salt - Hai kharabsheh"),
          lat: 32.0681410472841,
          long: 35.7594251894593,
        },
        {
          name: t("As-Salt - Tala'a kharabsheh"),
          lat: 32.0621408933569,
          long: 35.7649714484775,
        },
        {
          name: t("As-Salt"),
          lat: 32.0345830658587,
          long: 35.709638114514,
        },
        {
          name: t("As-Salt - Wadi Al Akrad"),
          lat: 32.041528046879,
          long: 35.7195726124173,
        },
        {
          name: t("As-Salt - Al Aizarieh"),
          lat: 32.034993493304,
          long: 35.7164633857946,
        },
        {
          name: t("As-Salt - Al Qalaa"),
          lat: 32.0408853696124,
          long: 32.0408853696124,
        },
        {
          name: t("As-Salt -Al Sittin Street"),
          lat: 32.0611632106428,
          long: 35.7031410590488,
        },
        {
          name: t("As-Salt - Wadi Shueib"),
          lat: 31.9910979285988,
          long: 35.7220551129908,
        },
        {
          name: t("As-Salt - Al-Magharib"),
          lat: 32.0288338575075,
          long: 35.6820781721502,
        },
        {
          name: t("As-Salt - Wadi Al-Rayah"),
          lat: 32.0549503515144,
          long: 35.7037802228592,
        },
        {
          name: t("As-Salt - Wadi Al-Shajar"),
          lat: 32.0557632169803,
          long: 35.7426803054387,
        },
        {
          name: t("As-Salt - Bqaa"),
          lat: 32.0385905142431,
          long: 35.7103088848455,
        },
        {
          name: t("As-Salt - Yezidia"),
          lat: 32.060632674501,
          long: 35.7728495427276,
        },
        {
          name: t("As-Salt - Sawaniyah"),
          lat: 32.0564251966674,
          long: 35.7227530027377,
        },
        {
          name: t("As-Salt - Naqb Al Dabbour"),
          lat: 32.0395644739321,
          long: 35.74934116916,
        },
        {
          name: t("As-Salt - Baqaan"),
          lat: 32.0595946591233,
          long: 35.7374371319641,
        },
        {
          name: t("As-Salt - Dababneh"),
          lat: 32.0526777064945,
          long: 35.7419113098503,
        },
        {
          name: t("As-Salt - Al Buhaira"),
          lat: 32.0595403182338,
          long: 35.7278776722811,
        },
        {
          name: t("As-Salt - Bayyouda"),
          lat: 32.1496960817374,
          long: 35.7327359399948,
        },
        {
          name: t("As-Salt - Batanah"),
          lat: 32.0134763416425,
          long: 35.7087880903743,
        },
        {
          name: t("As-Salt - Al Salalem"),
          lat: 32.0441693876854,
          long: 35.7346921427035,
        },
        {
          name: t("As-Salt -Al Mansheyye"),
          lat: 32.0337408339649,
          long: 35.7229327046504,
        },
        {
          name: t("As-Salt - Al Jadaa"),
          lat: 32.0371025993128,
          long: 35.7252596237154,
        },
        {
          name: t("Mahis"),
          lat: 31.9832284092596,
          long: 35.7625802246745,
        },
        {
          name: t("Fuheis"),
          lat: 32.0145322415717,
          long: 35.771971535977,
        },
        {
          name: t("Dead Sea"),
          lat: 31.828884589549,
          long: 35.6503893095392,
        },
        {
          name: t("Dead Sea - Swemeh"),
          lat: 31.7711712471541,
          long: 35.5954907991216,
        },
        {
          name: t("Dead Sea - Al Rama"),
          lat: 31.8103155881902,
          long: 35.665074682913,
        },
        {
          name: t("Dead Sea - Ar-Rawda"),
          lat: 31.8347780233722,
          long: 35.6654329794722,
        },
        {
          name: t("Dead Sea - Juwafat Al-Kafrayn"),
          lat: 31.8713507760811,
          long: 35.6458858385463,
        },
        {
          name: t("South Shuna"),
          lat: 31.94941523269,
          long: 35.6123083624245,
        },
        {
          name: t("Karameh - Jordan Valley"),
          lat: 31.988728107771,
          long: 35.562349318364,
        },
      ],
    },
    {
      name: t("Ajloun Governorate"),
      coordinate: {
        lat: 32.3335809,
        long: 35.7528188,
      },
      places: [
        {
          name: t("Ajloun Governorate"),
          lat: 32.3335809,
          long: 35.7528188,
        },
      ],
    },
    {
      name: t("Madaba Governorate"),
      coordinate: {
        lat: 31.7157555,
        long: 35.8189999,
      },
      places: [
        {
          name: t("Madaba - Western Madaba Road"),
          lat: 31.7633500665298,
          long: 35.7929810828385,
        },

        {
          name: t("Madaba - Khirbet al-Mukhayyat"),
          lat: 31.7535428708965,
          long: 35.6761246485521,
        },

        {
          name: t("Madaba - Malih"),
          lat: 31.5658845888273,
          long: 35.7867081254332,
        },
        {
          name: t("Madaba - Dhiban"),
          lat: 31.5135926388401,
          long: 35.8133016402326,
        },
        {
          name: t("Madaba - Ash Shuqayq"),
          lat: 31.468425402762,
          long: 35.7048990095578,
        },
        {
          name: t("Madaba - Wadi AlMujib"),
          lat: 31.4207234109734,
          long: 35.6509985873575,
        },
        {
          name: t("Madaba - Al Judyyidah"),
          lat: 31.7089056958315,
          long: 35.8008997114558,
        },
        {
          name: t("Madaba - Machaerus"),
          lat: 31.5693884966788,
          long: 35.6553051769874,
        },
        {
          name: t("Madaba - Easterm Madaba Road"),
          lat: 31.7471030058052,
          long: 35.8377520078493,
        },
        {
          name: t("Madaba -Al Tanmiyah"),
          lat: 31.7351866215953,
          long: 35.8019997486791,
        },
        {
          name: t("Madaba - Al Nasser"),
          lat: 31.7369648027686,
          long: 35.78399691528431,
        },
        {
          name: t("Madaba - Hanina"),
          lat: 31.7274838300817,
          long: 35.8034615157715,
        },
        {
          name: t("Madaba - Al Zaytooneh"),
          lat: 31.7232835208059,
          long: 35.8173607960005,
        },
        {
          name: t("Madaba - Muhammad Al Fateh"),
          lat: 31.7280732398875,
          long: 35.7891352421692,
        },
        {
          name: t("Madaba - Bayt Al Maqdes"),
          lat: 31.7213040756317,
          long: 35.7977116777826,
        },
        {
          name: t("Madaba - Al Hamd"),
          lat: 31.7183458439197,
          long: 35.8105096808236,
        },
        {
          name: t("Madaba - Al Kholafaa"),
          lat: 31.7231365998929,
          long: 35.7845230176198,
        },
        {
          name: t("Madaba - Al Hashimi"),
          lat: 31.7161958819976,
          long: 35.7944285424037,
        },
        {
          name: t("Madaba - Al Faihaa"),
          lat: 31.7129624538947,
          long: 35.783228123821,
        },
        {
          name: t("Madaba - Al Mokhayam"),
          lat: 31.7112899457789,
          long: 35.7867075411953,
        },
        {
          name: t("Madaba - Al Ulamaa"),
          lat: 31.7077033306356,
          long: 35.782178443933,
        },
        {
          name: t("Madaba - Al Andalus"),
          lat: 31.7026451862289,
          long: 35.7894386448206,
        },
        {
          name: t("Madaba - Abu Obaydah"),
          lat: 31.7049143329348,
          long: 35.7956866093568,
        },
        {
          name: t("Madaba - Al Jazira"),
          lat: 31.7010525023412,
          long: 35.8002711763418,
        },
        {
          name: t("Madaba - Al Nnozha"),
          lat: 31.6869863724167,
          long: 35.8129647743574,
        },
        {
          name: t("Madaba - Al Saadeh"),
          lat: 31.7019919235809,
          long: 35.8228901572929,
        },
        {
          name: t("Madaba - Al Zohour"),
          lat: 31.7120408629004,
          long: 35.8142802270424,
        },
        {
          name: t("Madaba - Mojamma Al Safariyat"),
          lat: 31.7143086069059,
          long: 35.8000460819082,
        },
        {
          name: t("Dhuheibah Al Sharqiyah"),
          lat: 31.8041738728114,
          long: 36.0459310878743,
        },
      ],
    },
    {
      name: t("Irbid Governorate"),
      coordinate: {
        lat: 32.5525058,
        long: 35.9253493,
      },
      places: [
        {
          name: t("Irbid - Judayta"),
          lat: 32.4020627276809,
          long: 35.7094768767783,
        },
        {
          name: t("Irbid - Kufr abeel"),
          lat: 32.4153519812522,
          long: 35.649187850983,
        },
        {
          name: t("Irbid - University Street"),
          lat: 32.5368086321348,
          long: 35.851403348757,
        },
        {
          name: t("Irbid - Kufr 'Awan"),
          lat: 32.4291954613283,
          long: 35.685899189445,
        },
        {
          name: t("Irbid - Bayt Idis"),
          lat: 32.4395901676083,
          long: 35.6968377723617,
        },
        {
          name: t("Irbid - Kufr Rakeb"),
          lat: 32.4593337143826,
          long: 35.6880769445459,
        },
        {
          name: t("Irbid - Kafr al Ma'a"),
          lat: 32.4765617278349,
          long: 35.6897006346964,
        },
        {
          name: t("Irbid - Der Abi Saeed"),
          lat: 32.5001457043523,
          long: 35.657293916882,
        },
        {
          name: t("Irbid - Tibnah"),
          lat: 32.4755411535887,
          long: 35.7288441863148,
        },
        {
          name: t("Irbid - Al-Hawi"),
          lat: 32.4327021764447,
          long: 35.7408740319048,
        },
        {
          name: t("Irbid - Zoubia"),
          lat: 32.4262993123733,
          long: 35.7698220861311,
        },
        {
          name: t("Irbid - Arhaba"),
          lat: 32.4337669403606,
          long: 35.8020697826939,
        },
        {
          name: t("Irbid - Al-Mazar As-Shamaliyah"),
          lat: 32.4638040124601,
          long: 35.8062009369595,
        },
        {
          name: t("Irbid - Shatana"),
          lat: 32.4245184377364,
          long: 35.8556434648856,
        },
        {
          name: t("Irbid - An-Nuayyimah"),
          lat: 32.4072132879497,
          long: 35.9081270993454,
        },
        {
          name: t("Irbid - Kitim"),
          lat: 32.4487939820008,
          long: 35.9028316887527,
        },
        {
          name: t("Irbid - Al-Husun"),
          lat: 32.4745523547363,
          long: 35.8955071903465,
        },
        {
          name: t("Irbid - Habka"),
          lat: 32.4639855772166,
          long: 35.844046616365,
        },
        {
          name: t("Irbid - Johfiyeh"),
          lat: 32.4925741518236,
          long: 35.8246694522554,
        },
        {
          name: t("Irbid - Dayr Yusuf"),
          lat: 32.4904359436162,
          long: 35.790685969053,
        },
        {
          name: t("Irbid - Inbah"),
          lat: 32.4768277578526,
          long: 35.7582987457503,
        },
        {
          name: t("Irbid - Rabiet Al Kura"),
          lat: 32.504850000566,
          long: 35.7383626099583,
        },
        {
          name: t("Irbid - Sammou"),
          lat: 32.514076257537,
          long: 35.7469385156203,
        },
        {
          name: t("Irbid - Jinnin Assafa"),
          lat: 32.5170445210882,
          long: 35.704320548485,
        },
        {
          name: t("Irbid - Ham"),
          lat: 32.509985751113,
          long: 35.812638257955,
        },
        {
          name: t("Irbid - Bayt Yafa"),
          lat: 32.5184629298576,
          long: 35.7784494810072,
        },
        {
          name: t("Irbid - Kafr Yaba"),
          lat: 32.540729152595,
          long: 35.8034738524288,
        },
        {
          name: t("Irbid - Dayr as Sinah"),
          lat: 32.534910292801,
          long: 35.7482452677778,
        },
        {
          name: t("Irbid - Kfraan"),
          lat: 32.5494266310883,
          long: 35.762205499443,
        },
        {
          name: t("Irbid - Taibah"),
          lat: 32.5490131716987,
          long: 35.7055192133843,
        },
        {
          name: t("Irbid - Smma"),
          lat: 32.583718097686,
          long: 35.6561194623858,
        },
        {
          name: t("Irbid - Qumaym"),
          lat: 32.5777960070925,
          long: 35.7211020213074,
        },
        {
          name: t("Irbid - Kufr Asad"),
          lat: 32.5960323977858,
          long: 35.7143298239231,
        },
        {
          name: t("Irbid - Saidour"),
          lat: 32.6080752693122,
          long: 35.6816260857714,
        },
        {
          name: t("Irbid - Duwaqarah"),
          lat: 32.6054977955436,
          long: 35.73531443378,
        },
        {
          name: t("Irbid - Jumha"),
          lat: 32.556271536458,
          long: 35.7854889968783,
        },
        {
          name: t("Irbid - Sum"),
          lat: 32.5833554361713,
          long: 35.7961154108337,
        },
        {
          name: t("Irbid - Umm Qais"),
          lat: 32.6502043982725,
          long: 35.6775229023374,
        },
        {
          name: t("Irbid - Umm Qais"),
          lat: 32.6881003159037,
          long: 35.6831979653247,
        },
        {
          name: t("Irbid - Malka"),
          lat: 32.6554528256882,
          long: 35.7413650386444,
        },
        {
          name: t("Irbid - Hatim"),
          lat: 32.6429796256783,
          long: 35.7717345660871,
        },
        {
          name: t("Irbid - Beit Ras"),
          lat: 32.5977691227164,
          long: 35.8543734541762,
        },
        {
          name: t("Irbid - Kufr Jayes"),
          lat: 32.6144182688202,
          long: 35.833288437012,
        },
        {
          name: t("Irbid - Hakama"),
          lat: 32.5899996470493,
          long: 35.8833226327934,
        },
        {
          name: t("Irbid - Natifa"),
          lat: 32.5164543449462,
          long: 35.8269166315268,
        },
        {
          name: t("Irbid - As-Sarih"),
          lat: 32.5040079104367,
          long: 35.8932546866149,
        },
        {
          name: t("Irbid - Huwwarah"),
          lat: 32.542580813489,
          long: 35.9232452105665,
        },
        {
          name: t("Irbid - Bushra"),
          lat: 32.5563444682217,
          long: 35.8975892167811,
        },
        {
          name: t("Irbid - Sal"),
          lat: 32.5689937623726,
          long: 35.9158037392556,
        },
        {
          name: t("Irbid - Saham"),
          lat: 32.6983892872695,
          long: 35.7720808612461,
        },
        {
          name: t("Irbid - Agraba"),
          lat: 32.7269396596249,
          long: 35.7880931024003,
        },
        {
          name: t("Irbid - Al Rafeed"),
          lat: 32.70775736815,
          long: 35.8228023827913,
        },
        {
          name: t("Irbid - Kafr Sawm"),
          lat: 32.6786903600398,
          long: 35.812068578993,
        },
        {
          name: t("Irbid - Harta"),
          lat: 32.7131678752699,
          long: 35.856132584337,
        },
        {
          name: t("Irbid - Harta"),
          lat: 32.6599453646858,
          long: 35.8307380850767,
        },
        {
          name: t("Irbid - Kharja"),
          lat: 32.6544257294389,
          long: 35.8858610019467,
        },
        {
          name: t("Irbid - Alal"),
          lat: 32.6231872377269,
          long: 35.8997867354303,
        },
        {
          name: t("Irbid - Maru"),
          lat: 32.601435703101,
          long: 35.8973493825729,
        },
        {
          name: t("Irbid - Saru"),
          lat: 32.6409268948019,
          long: 35.8527114723914,
        },
        {
          name: t("Irbid - Aydoun - Al - Lawazim"),
          lat: 32.5137410535789,
          long: 35.8649088478507,
        },
        {
          name: t("Irbid - Aydoun - Rahibat"),
          lat: 32.5100904551713,
          long: 35.8631404388718,
        },
        {
          name: t("Irbid - Ghernata College"),
          lat: 32.5111153318764,
          long: 35.862366262327,
        },
        {
          name: t("Irbid - Southern Neighbourhood"),
          lat: 32.5408231016664,
          long: 35.8346226167305,
        },
        {
          name: t("Irbid - Eastern Neighbourhood"),
          lat: 32.5604290134791,
          long: 35.8677798009642,
        },
        {
          name: t("Irbid - Western Neighbourhood"),
          lat: 32.5691609172455,
          long: 35.824101640423,
        },
        {
          name: t("Irbid - Western Neighbourhood Hai Al Turkuman"),
          lat: 32.5566012911492,
          long: 35.8292481302088,
        },
        {
          name: t("Irbid - Western Neighbourhood Princess Basma Hospital"),
          lat: 32.5586072888873,
          long: 35.8377610664632,
        },
        {
          name: t("Irbid - Al Swaniyah"),
          lat: 32.5611858553545,
          long: 35.8262004931729,
        },
        {
          name: t("Irbid - Al Ashrafiyah"),
          lat: 32.576765828374,
          long: 35.8228469278661,
        },
        {
          name: t("Irbid - Aghwar Shamaliyah"),
          lat: 32.5124701509115,
          long: 35.5995033411374,
        },
        {
          name: t("Irbid - Aghwar Janoobiyah"),
          lat: 31.0021218917266,
          long: 35.4553302150867,
        },
        {
          name: t("Irbid - Downtown"),
          lat: 32.5535445543735,
          long: 35.8499907735436,
        },
        {
          name: t("Ar - Ramtha"),
          lat: 32.6064016152129,
          long: 35.9913857298148,
        },
        {
          name: t("Ar - Ramtha - At Turrah"),
          lat: 32.6251870338436,
          long: 35.9843483679726,
        },
        {
          name: t("Ar - Ramtha - King Abdullah University Hospital"),
          lat: 32.4935352085371,
          long: 35.9863289653496,
        },
        {
          name: t("North Shuna"),
          lat: 32.5247277149439,
          long: 35.5906033523249,
        },
        {
          name: t("North Shuna - Al Adassiyah"),
          lat: 32.6568238767086,
          long: 35.6238330427276,
        },
        {
          name: t("North Shuna - Al Mashargah"),
          lat: 32.640543338207,
          long: 35.5839672516193,
        },
        {
          name: t("North Shuna"),
          lat: 32.4965054601297,
          long: 35.6113280812226,
        },
        {
          name: t("North Shuna - Mughayir"),
          lat: 32.5786328601365,
          long: 35.5992962683899,
        },
        {
          name: t("North Shuna -Waqqas"),
          lat: 32.5534223384646,
          long: 35.5839253014015,
        },
        {
          name: t("North Shuna - Shaykh Husayn"),
          lat: 32.4929092102718,
          long: 35.5747528247154,
        },
        {
          name: t("North Shuna - Tabqet Fahel"),
          lat: 32.3949513824906,
          long: 35.5851250203935,
        },
        {
          name: t("North Shuna - Kuraymah"),
          lat: 32.2879436343799,
          long: 35.5745079630591,
        },
      ],
    },
    {
      name: t("Jerash Governorate"),
      coordinate: {
        lat: 32.2730386,
        long: 35.91988,
      },
      places: [
        {
          name: t("Jerash - Balila"),
          lat: 32.382211909954,
          long: 35.9317733809743,
        },
        {
          name: t("Jerash - Qafqafa"),
          lat: 32.3326305290134,
          long: 35.9460188223025,
        },
        {
          name: t("Jerash - Kufr Khall"),
          lat: 32.3653299349121,
          long: 35.9033396611727,
        },
        {
          name: t("Jerash - Souf"),
          lat: 32.3230141295274,
          long: 35.8347358621674,
        },
        {
          name: t("Jerash - Sakib"),
          lat: 32.2765391314353,
          long: 35.7972909899396,
        },
        {
          name: t("Jerash - Raymun"),
          lat: 32.2771323403003,
          long: 35.8233468584551,
        },
        {
          name: t("Jerash - Al-Kittah"),
          lat: 32.2739114000034,
          long: 35.8421081800937,
        },
        {
          name: t("Jerash - Al-Hussayniyah"),
          lat: 32.2499567437342,
          long: 35.7938700879697,
        },
        {
          name: t("Jerash - Borma"),
          lat: 32.2089382109239,
          long: 35.7451414544473,
        },
        {
          name: t("Jerash - Marsaa"),
          lat: 32.1475398057855,
          long: 35.8581762296885,
        },
        {
          name: t("Jerash - Mastaba"),
          lat: 32.1946947405356,
          long: 35.8852508832567,
        },
        {
          name: t("Jerash"),
          lat: 32.2832002583201,
          long: 35.9210979735881,
        },
        {
          name: t("Jerash  - Enaiba"),
          lat: 32.2280531018554,
          long: 35.9575636648627,
        },
        {
          name: t("Jerash - Al Kfair"),
          lat: 32.2067152506869,
          long: 35.9462505073522,
        },
      ],
    },
    {
      name: t("Al Mafraq Governorate"),
      coordinate: {
        lat: 32.340972,
        long: 36.2247393,
      },
      places: [
        {
          name: t("Al-Mafraq - Balama"),
          lat: 32.2577056655006,
          long: 36.0877344368039,
        },
      ],
    },
    {
      name: t("At-Tafilah Governorate"),
      coordinate: {
        lat: 30.7938253209524,
        long: 35.6965582931366,
      },
      places: [
        {
          name: t("At-Tafilah"),
          lat: 30.7938253209524,
          long: 35.6965582931366,
        },
      ],
    },
    {
      name: t("Kerak Governorate"),
      coordinate: {
        lat: 31.1853828,
        long: 35.7094968,
      },
      places: [
        {
          name: t("Karak - Kerak"),
          lat: 31.1843545909591,
          long: 35.7042510110384,
        },
        {
          name: t("Karak - Kerak - Thallaja"),
          lat: 31.1686132828922,
          long: 35.6998460122181,
        },
        {
          name: t("Karak - Kerak - Al Marj"),
          lat: 31.1685684434818,
          long: 35.7076747076985,
        },
        {
          name: t("Karak - Kerak - Al Thunayya"),
          lat: 31.1608850933383,
          long: 35.7311201533658,
        },
        {
          name: t("Karak - Kerak - Al-Mughayer"),
          lat: 31.4026517602241,
          long: 35.7671249460814,
        },
        {
          name: t("Karak - Kerak - As-Simakiyah"),
          lat: 31.2990786803681,
          long: 35.8052310507584,
        },
        {
          name: t("Karak - Kerak - Al -Qasr"),
          lat: 31.2990786803681,
          long: 35.744492677216,
        },
        {
          name: t("Karak - Kerak - Faqqu"),
          lat: 31.3638070202546,
          long: 35.7078538548535,
        },
        {
          name: t("Karak - Kerak - Amra"),
          lat: 31.3492464769896,
          long: 35.6780568938998,
        },
        {
          name: t("Karak - Kerak - Sirfa"),
          lat: 31.3314782234223,
          long: 35.6608680269109,
        },
        {
          name: t("Karak - Kerak - Feifa"),
          lat: 30.9307319992741,
          long: 35.4156964234067,
        },
        {
          name: t("Karak - Kerak - Gawr as - Safi"),
          lat: 31.188535934688,
          long: 35.5426707184463,
        },
        {
          name: t("Karak - Kerak - Rakin"),
          lat: 31.2214207254799,
          long: 35.6926944179873,
        },
        {
          name: t("Karak - Kerak - Al Shihabeyya"),
          lat: 31.1867790837405,
          long: 35.6862059082923,
        },
        {
          name: t("Karak -Kerak - Samra"),
          lat: 31.2174710494896,
          long: 35.6398028772234,
        },
        {
          name: t("Karak - Kerak - Ezra"),
          lat: 31.1607053548264,
          long: 35.6876551238932,
        },
        {
          name: t("Karak - Kerak - kathraba"),
          lat: 31.1345049251752,
          long: 35.6276520488439,
        },
        {
          name: t("Karak - Kerak - Aiy"),
          lat: 31.1348103219339,
          long: 35.6544759784782,
        },
        {
          name: t("Karak - Kerak - At-Tayyibah"),
          lat: 31.0428603486578,
          long: 35.6142280223564,
        },
        {
          name: t("Karak - Kerak - Iraq"),
          lat: 31.089259309226,
          long: 35.6338671616425,
        },
        {
          name: t("Karak - Kerak - Khresha"),
          lat: 31.0117077940407,
          long: 35.6730593307377,
        },
        {
          name: t("Karak - Kerak - Dhat Rass"),
          lat: 30.9833065236406,
          long: 35.7910153698145,
        },
        {
          name: t("Karak - Kerak - Muhyi"),
          lat: 30.9531448430121,
          long: 35.917300413751,
        },
        {
          name: t("Karak - Kerak - Al Hussayniyah"),
          lat: 31.0239983637252,
          long: 35.7224324361126,
        },
        {
          name: t("Karak -Kerak - Muab"),
          lat: 31.0309775900689,
          long: 35.7403608539753,
        },
        {
          name: t("karak - Kerak - Al -Khalidya"),
          lat: 31.0337408883926,
          long: 35.7769259031862,
        },
        {
          name: t("Karak - Kerak - Al Omareya"),
          lat: 31.0414558063939,
          long: 35.7178051724424,
        },
        {
          name: t("Karak - Kerak - Soul"),
          lat: 31.0619022207134,
          long: 35.7301672471813,
        },
        {
          name: t("Karak - Kerak - Al -Mazar"),
          lat: 31.0667663980436,
          long: 35.7095558842295,
        },
        {
          name: t("Karak - Kerak - Mutah"),
          lat: 31.0983109266098,
          long: 35.6964997555623,
        },
        {
          name: t("Karak - Kerak - Al -Adnanya"),
          lat: 31.1140811290256,
          long: 35.6992589501377,
        },
        {
          name: t("Karak - Kerak - Al Hueyye - Al Senaa"),
          lat: 31.1478908301564,
          long: 35.7045425836881,
        },
        {
          name: t("Karak - Kerak - Ghuwair"),
          lat: 31.1402145450539,
          long: 35.7565677145864,
        },
        {
          name: t("Karak - Kerak - Al Mushairfeh"),
          lat: 31.1408821012734,
          long: 35.7229517355491,
        },
        {
          name: t("Karak - Kerak - Al -Qatrana"),
          lat: 31.234047336424,
          long: 36.0749178780791,
        },
        {
          name: t("Gawr as-Safi"),
          lat: 31.008110382741,
          long: 35.4271246097711,
        },
        {
          name: t("AL-Gawr"),
          lat: 31.845778858526,
          long: 35.6371860585816,
        },
      ],
    },
    {
      name: t("Maan Governorate"),
      coordinate: {
        lat: 30.1964487,
        long: 35.7378701,
      },
      places: [
        {
          name: t("Maan Governorate"),
          lat: 30.2501502125757,
          long: 35.9351034540899,
        },
        {
          name: t("Wadi Musa"),
          lat: 30.3294779100036,
          long: 35.5108648071579,
        },
        {
          name: t("Shobak"),
          lat: 30.5096305828271,
          long: 35.606769224558,
        },
      ],
    },
    {
      name: t("Aqaba Governorate"),
      coordinate: {
        lat: 29.5448886,
        long: 35.0460428,
      },
      places: [
        {
          name: t("Al aqaba"),
          lat: 29.4696313378663,
          long: 34.986993283889,
        },
        {
          name: t("Aqaba - Al Shamiyah"),
          lat: 29.5847288894326,
          long: 35.0596799039934,
        },
        {
          name: t("Aqaba - Industrial City"),
          lat: 29.5942591437002,
          long: 35.0273977179345,
        },
        {
          name: t("Aqaba - Al Herafeya Area"),
          lat: 29.556365087635,
          long: 35.0294159449564,
        },
        {
          name: t("Aqaba - Al Karamah"),
          lat: 29.5618304813208,
          long: 35.025410048417,
        },
        {
          name: t("Aqaba - Eleventh Area"),
          lat: 29.56435449796,
          long: 35.0335714938469,
        },
        {
          name: t("Aqaba - Ninth Area"),
          lat: 29.5519082964434,
          long: 35.0360112427403,
        },
        {
          name: t("Aqaba - Fifth Area"),
          lat: 29.536507456557,
          long: 35.0162540597935,
        },
        {
          name: t("Aqaba - Fourth Area"),
          lat: 29.5267443510927,
          long: 35.0084901620284,
        },
        {
          name: t("Aqaba - Al Khazzan"),
          lat: 29.5248254838287,
          long: 35.0185238314143,
        },
        {
          name: t("Aqaba - Salah Al Dein Neighbourhood"),
          lat: 29.5193410356788,
          long: 35.0066844232578,
        },
        {
          name: t("Aqaba - Al Shallaleh"),
          lat: 29.5245319483294,
          long: 35.0151242746065,
        },
        {
          name: t("Aqaba - Al Ghandour Beach"),
          lat: 29.5212940024008,
          long: 35.0016508550466,
        },
        {
          name: t("Aqaba - Al Mohandeseen Housing"),
          lat: 29.5396308374265,
          long: 35.011314674467,
        },
        {
          name: t("Aqaba - Medical Housing"),
          lat: 29.5444482289903,
          long: 35.0155550285208,
        },
        {
          name: t("Aqaba - Third Area"),
          lat: 29.5504374948653,
          long: 35.0172800766926,
        },
        {
          name: t("Aqaba - Sixth Area"),
          lat: 29.5501025768382,
          long: 35.0103255763938,
        },
  
        {
          name: t("Aqaba - Eighth Area"),
          lat: 29.5580590330215,
          long: 35.0147407602818,
        },
        {
          name: t("Aqaba - Seventh Area"),
          lat: 29.5514982802132,
          long: 35.0239942403267,
        },
        {
          name: t("Aqaba - Al Rimal Area"),
          lat: 29.5567189984164,
          long: 35.0018575713392,
        },
        {
          name: t("Aqaba - Al Mahdoud Area"),
          lat: 29.5501677545979,
          long: 35.001884794555,
        },
        {
          name: t("Aqaba - Al Shaabeya Area"),
          lat: 29.5458719742322,
          long: 35.0022219070827,
        },
      ],
    },
  ];
  
  // Function to remove quotes from names
  const removeQuotes = (array) => {
    return array.map((item) => {
      item.name = item.name.replace(/"t\(([^)]+)\)"/g, "t($1)");
      item.places = item.places.map((place) => ({
        ...place,
        name: place.name.replace(/"t\(([^)]+)\)"/g, "t($1)"),
      }));
      return item;
    });
  };

  // Filter cities based on search query
  const filteredCities = removeQuotes(placesFilter).filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset location and street when returning back
  useEffect(() => {
    if (isItReturnBack) {
      setLocation("");
    }
  }, [isItReturnBack]);

  // Handle place selection and API call
  const handlePlacePress = async (place) => {
    const apiUrl = `https://backend.sakanijo.com/places/filter/city?longitude=${place.long}&latitude=${place.lat}&name=${place.name} ${location}`;
    try {
      await SecureStore.setItemAsync("apiLink", apiUrl);
      await SecureStore.setItemAsync("placeName", place.name);
      await SecureStore.setItemAsync("mapData", JSON.stringify({ lat: place.lat, long: place.long }));
      dispatch(setFilter(true));

      const response = await axios.get(apiUrl);
      dispatch(setPlaces(response.data.places));
      dispatch(setFilter());
      router.push("/(tabs)/");
    } catch (error) {
      console.error("Error fetching places:", error.response.data.error);
    }
  };

  // Render city selection
  const renderCitySelection = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="ابحث عن مدينة"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.label}>{t("select city")}</Text>
      {filteredCities.slice(0, 12).map((cityData) => (
        <TouchableOpacity
          key={cityData.name}
          onPress={() => setLocation(cityData.name)}
        >
          <Text style={styles.item}>{t(cityData.name)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render place selection based on selected city
  const renderPlaceSelection = () => {
    if (!location) return null;

    const cityData = removeQuotes(placesFilter).find((cityData) => cityData.name === location);
    const places = cityData ? cityData.places : [];

    
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن منطقة"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.label}>{location}</Text>
        {places.filter(place => place.name.toLowerCase().includes(searchQuery.toLowerCase())).map((place) => (
          <TouchableOpacity key={place.lat} onPress={() => handlePlacePress(place)}>
            <Text style={styles.item}>{t(place.name)}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => setReturn(!isItReturnBack)}>
            <Text style={{ fontFamily: "droidAr" }}>الرجوع</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  };

  return location ? renderPlaceSelection() : renderCitySelection();
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F8F8F8",
  },
  label: {
    fontSize: 16,
    fontFamily: "Droid Arabic Kufi",
    marginBottom: 8,
    color: "#333",
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: "Droid Arabic Kufi",
    marginBottom: 16,
    backgroundColor: "#FFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  spaceInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "Droid Arabic Kufi",
  },
  buttonSelected: {
    backgroundColor: Colors.primary,
  },
  checkboxContainer: {
    backgroundColor: "#FFF",
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    fontFamily: "Droid Arabic Kufi",
    color: "#333",
  },
  item: {
    fontSize: 16,
    fontFamily: "Droid Arabic Kufi",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  submitButtonText: {
    fontFamily: "DroidArabicKufi",
    color: "white",
  },
});

export default FilterPlace;
