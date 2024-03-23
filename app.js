$(document).ready(function () {
    LoadWords();

    $("#allParts").on("dblclick", "option", function() {
        addWord($(this).text());
    });

    function addWord(name) {
        var word = '<div class="item">' + name + '<button class="moveUp">上に移動</button><button class="moveDown">下に移動</button><button class="remove">削除</button></div>';
        $("#items").append(word);
    }

    $("#items").on("click", ".moveUp", function(){
        var currentItem = $(this).closest(".item");
        var prevItem = currentItem.prev(".item");
        if (prevItem.length !== 0) {
            currentItem.insertBefore(prevItem);
        }
    });

    $("#items").on("click", ".moveDown", function(){
        var currentItem = $(this).closest(".item");
        var nextItem = currentItem.next(".item");
        if (nextItem.length !== 0) {
            currentItem.insertAfter(nextItem);
        }
    });

    $("#items").on("click", ".remove", function(){
        $(this).closest(".item").remove();
    });

    $(document).on("click", "#clear", function(){
        $("#items").empty();
    });

    var isPlaying = false;
    $("#play").click(function() {
        isPlaying = !isPlaying;
        $(this).text(isPlaying ? "停止" : "再生");

        if (isPlaying) {
            console.log("start");
            playAnnounce(getPathsForItems(), 0);
        } else {
            console.log("stop");
            stopAudio(audio);
        }
    });

    $("#testPlay").click(function() {
        var selectedName = $("#allParts").val();
        var path = getPathByName(selectedName);

        if (path) {
            audio.src = path;
            audio.play();
        }
    });

    let audio = new Audio();

    function playAnnounce(paths, index) {
        if (index < paths.length) {
            audio.src = paths[index];
    
            audio.onended = function () {
                playAnnounce(paths, ++index);
            }
            audio.play();
        } else {
            isPlaying = false;
            console.log("stop");
            $("#play").text("再生");
        }
    }

    function stopAudio(audio)
    {
        if (audio instanceof Audio)
        {
            audio.pause();
            audio.currentTime = 0;
        }
    }
});

function LoadWords() {
    try {
        $.each(wordsData, function(_, optionData) {
            $("<option>").text(optionData.name).val(optionData.name).appendTo("#allParts");
        });
    } catch (error) {
        console.error("データの読み込み中にエラーが発生しました。", error);
    }
}

function getPathByName(name) {
    try {
        const foundItem = wordsData.find(item => item.name === name);
        if (foundItem) {
            return foundItem.path;
        } else {
            console.error(`"${name}" に対応するパスが見つかりませんでした。`);
            return "";
        }
    } catch (error) {
        console.error("データを取得できませんでした。 ", error);
        return "";
    }
}

function getPathsForItems() {
    var paths = [];
    $("#items").children(".item").each(function() {
        var name = $(this).contents().first().text().trim();
        var path = getPathByName(name);
        paths.push(path);
    });
    return paths;
}