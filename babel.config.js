module.exports = {
    presets: [
        '@vue/app'
    ],
    //按需引入
   "plugins": [
        ["import", 
            {
                "libraryName": "iview",
                "libraryDirectory": "src/components"
            },
            'iview'
        ],
        'lodash'
   ]
}
