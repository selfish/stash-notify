// SAMPLE
this.manifest = {
    "name": "Stash Pull Request Notifier",
    "icon": "../../icons/icon32.png",
    "settings": [
        {
            "tab": i18n.get("information"),
            "group": i18n.get("stash_server"),
            "name": "refreshInterval",
            "type": "popupButton",
            "label": i18n.get("update_frequency"),
            "options": {
                "values": [
                    {
                        "text": "1 Minute",
                        "value": 1000 * 60
                    }, {
                        "text": "2 Minutes",
                        "value": 1000 * 60 * 2
                    }, {
                        "text": "5 Minutes",
                        "value": 1000 * 60 * 5
                    }, {
                        "text": "10 Minutes",
                        "value": 1000 * 60 * 10
                    }, {
                        "text": "30 Minutes",
                        "value": 1000 * 60 * 30
                    }, {
                        "text": "1 Hour",
                        "value": 1000 * 60 * 60
                    }
                ]
            }
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("stash_server"),
            "name": "server",
            "type": "text",
            "label": i18n.get("server_address"),
            "text": i18n.get("url_example")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("stash_server"),
            "name": "username",
            "type": "text",
            "label": i18n.get("username"),
            "text": i18n.get("x-characters")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("pull_requests"),
            "name": "scrum_master",
            "type": "checkbox",
            "label": i18n.get("Scrum master mode")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("pull_requests"),
            "name": "scrum_master_description",
            "type": "description",
            "text": i18n.get("scrum_master_description")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("pull_requests"),
            "name": "hide_pr_with_tasks",
            "type": "checkbox",
            "label": i18n.get("hide_pr_with_tasks")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("notifications"),
            "name": "notify",
            "type": "checkbox",
            "label": i18n.get("notify_new")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("notifications"),
            "name": "snooze_this_btn",
            "type": "checkbox",
            "label": i18n.get("snooze_this_btn")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("notifications"),
            "name": "snooze_all_btn",
            "type": "checkbox",
            "label": i18n.get("snooze_all_btn")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("notifications"),
            "name": "repeatUntilNoticed",
            "type": "popupButton",
            "label": "Notify until:",
            "options": {
                "values": [
                    {
                        "text": "Shown once",
                        "value": "once"
                    }, {
                        "text": "Clicked",
                        "value": "click"
                    }, {
                        "text": "As long as active",
                        "value": "always"
                    }
                ]
            }
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("notifications"),
            "name": "notifyInterval",
            "type": "popupButton",
            "label": i18n.get("show_notifications_every"),
            "options": {
                "values": [
                    {
                        "text": "1 Minute",
                        "value": 1000 * 60
                    }, {
                        "text": "2 Minutes",
                        "value": 1000 * 60 * 2
                    }, {
                        "text": "5 Minutes",
                        "value": 1000 * 60 * 5
                    }, {
                        "text": "10 Minutes",
                        "value": 1000 * 60 * 10
                    }, {
                        "text": "30 Minutes",
                        "value": 1000 * 60 * 30
                    }, {
                        "text": "1 Hour",
                        "value": 1000 * 60 * 60
                    }, {
                        "text": "2 Hours",
                        "value": 1000 * 60 * 60 * 2
                    }
                ]
            }
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("notifications"),
            "name": "snooze_duration",
            "type": "popupButton",
            "label": i18n.get("snooze_duration"),
            "options": {
                "values": [
                    {
                        "text": "5 Minutes",
                        "value": 1000 * 60 * 5
                    }, {
                        "text": "10 Minutes",
                        "value": 1000 * 60 * 10
                    }, {
                        "text": "20 Minutes",
                        "value": 1000 * 60 * 20
                    }, {
                        "text": "30 Minutes",
                        "value": 1000 * 60 * 30
                    }, {
                        "text": "1 Hour",
                        "value": 1000 * 60 * 60
                    }, {
                        "text": "2 Hours",
                        "value": 1000 * 60 * 60 * 2
                    }, {
                        "text": "4 Hours",
                        "value": 1000 * 60 * 60 * 4
                    }, {
                        "text": "8 Hours",
                        "value": 1000 * 60 * 60 * 8
                    }
                ]
            }
        },
        //{
        //    "tab": i18n.get("information"),
        //    "group": i18n.get("login"),
        //    "name": "username",
        //    "type": "text",
        //    "label": i18n.get("username"),
        //    "text": i18n.get("x-characters")
        //},
        //{
        //    "tab": i18n.get("information"),
        //    "group": i18n.get("login"),
        //    "name": "password",
        //    "type": "text",
        //    "label": i18n.get("password"),
        //    "text": i18n.get("x-characters-pw"),
        //    "masked": true
        //},
        //{
        //    "tab": i18n.get("information"),
        //    "group": i18n.get("login"),
        //    "name": "login",
        //    "type": "checkbox",
        //    "label": i18n.get("login_offline")
        //
        //},
        {
            "tab": i18n.get("information"),
            "group": i18n.get("appearance"),
            "name": "multiline_popup",
            "type": "checkbox",
            "label": i18n.get("multiline_popup")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("appearance"),
            "name": "hide_popup_head",
            "type": "checkbox",
            "label": i18n.get("hide_popup_head")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("appearance"),
            "name": "hide_bottom_bar",
            "type": "checkbox",
            "label": i18n.get("hide_bottom_bar")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("appearance"),
            "name": "show_repo_icon",
            "type": "checkbox",
            "label": i18n.get("show_repo_icon")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("appearance"),
            "name": "line_height",
            "type": "popupButton",
            "label": i18n.get("display_density"),
            "options": {
                "values": [
                    {
                        "text": "Comfortable",
                        "value": "7"
                    }, {
                        "text": "Cozy",
                        "value": "4"
                    }, {
                        "text": "Compact",
                        "value": "1"
                    }
                ]
            }
        }
        //{
        //    "tab": i18n.get("information"),
        //    "group": i18n.get("login"),
        //    "name": "myDescription",
        //    "type": "description",
        //    "text": i18n.get("description")
        //},
        //{
        //    "tab": i18n.get("information"),
        //    "group": i18n.get("logout"),
        //    "name": "myCheckbox",
        //    "type": "checkbox",
        //    "label": i18n.get("enable")
        //},
        //{
        //    "tab": i18n.get("information"),
        //    "group": i18n.get("logout"),
        //    "name": "myButton",
        //    "type": "button",
        //    "label": i18n.get("disconnect"),
        //    "text": i18n.get("logout")
        //},
        //{
        //    "tab": "Details",
        //    "group": "Sound",
        //    "name": "noti_volume",
        //    "type": "slider",
        //    "label": "Notification volume:",
        //    "max": 1,
        //    "min": 0,
        //    "step": 0.01,
        //    "display": true,
        //    "displayModifier": function (value) {
        //        return (value * 100).floor(2) + "%";
        //    }
        //},
        //{
        //    "tab": "Details",
        //    "group": "Sound",
        //    "name": "sound_volume",
        //    "type": "slider",
        //    "label": "Sound volume:",
        //    "max": 100,
        //    "min": 0,
        //    "step": 1,
        //    "display": true,
        //    "displayModifier": function (value) {
        //        return value + "%";
        //    }
        //},
        //{
        //    "tab": "Details",
        //    "group": "Food",
        //    "name": "myListBox",
        //    "type": "listBox",
        //    "label": "Soup 2 should be:",
        //    "options": [
        //        ["hot", "Hot and yummy"],
        //        ["cold"]
        //    ]
        //},
        //{
        //    "tab": "Details",
        //    "group": "Food",
        //    "name": "myRadioButtons",
        //    "type": "radioButtons",
        //    "label": "Soup 3 should be:",
        //    "options": [
        //        ["hot", "Hot and yummy"],
        //        ["cold"]
        //    ]
        //}
    ],
    "alignment": [
        [
            "server",
            "username"
            //"password"
        ]

    ]
};
