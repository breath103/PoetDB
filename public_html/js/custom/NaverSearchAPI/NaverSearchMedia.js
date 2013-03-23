function NaverSearchMedia()
{
    this.LastSearchParam = null;
    this.LastResult = {};
    this.LastResult["total"] = 0;
    this.LastResult["items"] = [];
};


NaverSearchMedia.prototype =
    {
        Search: function (Param) {
            /*
            Param(JSON):
            ** �⺻ ���� **
            query : string
            display : int [optional] defaultly 10,
            start   : int [optional] defaultly 1
            target  : string [optional] defaultly movie

            ** genre���� ���ڴ� �������� �߰��ɼ����� **
            */
            if (undefined == Param["query"]) return;
            if (undefined == Param["display"]) Param["display"] = 10;
            if (undefined == Param["target"]) Param["target"] = "movie";
            if (undefined == Param["start"]) Param["start"] = 1;
            this.LastSearchParam = Param;

            var strcall = "";
            for (var elem in Param) {
                strcall += escape(elem) + "=" + escape(Param[elem]) + "&";
            }

            var colret = [];
            var total = 0;
            var req = new XMLHttpRequest();
            $.ajax({ url: "Proxy.aspx",
                async: false,
                success: function (result) {
                    var jchannel = $(result).find("channel");
                    total = parseInt(jchannel.find("total").text());

                    var jcolitem = jchannel.find("item");
                    for (var i = 0; i < jcolitem.length; i++) {
                        var jitem = $(jcolitem[i]);
                        var jsonitem = {};
                        for (var p = 0; p < jcolitem[i].childNodes.length; p++) {
                            jsonitem[jcolitem[i].childNodes[p].nodeName] = jcolitem[i].childNodes[p].text;
                        }
                        colret[colret.length] = jsonitem;
                    }
                },
                error: function (Xhr, Status, Error) {
                    return;
                },
                data: strcall,
                type: "POST"
            });

            this.LastResult["total"] = total;
            this.LastResult["items"] = colret;
            return colret;
        },
        SearchMovie: function (Param) { // ��ȭ�� �˻��Ѵ�
            Param["target"] = "movie";
            return this.Search(Param);
        },
        SearchBook: function (Param) {  // å�� �˻��Ѵ� 
            Param["target"] = "book";
            return this.Search(Param);
        },
        NextSearch: function () { // �ٷ� �� �˻������ ���� Next Search�� �Ѵ�.
            if (this.LastSearchParam == null) return;
            this.LastSearchParam["start"] += this.LastSearchParam["display"];
            return this.Search(this.LastSearchParam);
        }
    };
